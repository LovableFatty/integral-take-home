import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { getIntakesForUser } from "@/lib/intake-queries";
import { GetIntakesResponse } from "@/types/intake";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET() {
  try {
    const user = await requireAuth();
    const intakes = await getIntakesForUser(user.id, user.role);
    return NextResponse.json<GetIntakesResponse>({ intakes });
  } catch (error) {
    console.error("Get intakes error:", error);
    
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch intakes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    // Parse FormData
    const formData = await request.formData();
    const dataJson = formData.get("data") as string;
    
    if (!dataJson) {
      return NextResponse.json(
        { error: "Missing form data" },
        { status: 400 }
      );
    }

    const intakeData = JSON.parse(dataJson) as {
      userId: string;
      clientName: string;
      clientEmail: string;
      clientPhone: string;
      dateOfBirth: string;
      ssn: string;
      fullAddress: string;
      description: string;
      notes?: string;
    };

    // Verify the userId matches the authenticated user
    if (intakeData.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Validate required fields
    const {
      clientName,
      clientEmail,
      clientPhone,
      dateOfBirth,
      ssn,
      fullAddress,
      description,
      notes,
    } = intakeData;

    // Validate required fields
    if (!clientName || !clientEmail || !clientPhone || !dateOfBirth || !ssn || !fullAddress || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create intake record with PENDING status
    const intakeDataInput: {
      clientName: string;
      clientEmail: string;
      clientPhone: string;
      dateOfBirth: string;
      ssn: string;
      fullAddress: string;
      description: string;
      notes: string | null;
      status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";
      submittedById: string;
    } = {
      clientName,
      clientEmail,
      clientPhone,
      dateOfBirth,
      ssn,
      fullAddress,
      description,
      notes: notes || null,
      status: "PENDING",
      submittedById: user.id,
    };

    const intake = await prisma.intake.create({
      data: intakeDataInput,
    });

    // Handle file uploads
    const files = formData.getAll("files") as File[];
    const fileTypes = formData.getAll("fileTypes") as string[];
    const uploadedDocuments = [];

    // File validation constants
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_FILE_TYPES = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];

    if (files.length > 0) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), "uploads", intake.id);
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const documentType = fileTypes[i] || "OTHER";

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: `File "${file.name}" exceeds maximum size of 10MB` },
            { status: 400 }
          );
        }

        // Validate file type
        const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
        const isValidType = 
          ALLOWED_FILE_TYPES.includes(file.type) || 
          ALLOWED_EXTENSIONS.includes(fileExtension);

        if (!isValidType) {
          return NextResponse.json(
            { error: `File "${file.name}" has an invalid file type. Allowed types: PDF, JPG, PNG, DOC, DOCX` },
            { status: 400 }
          );
        }

        // Sanitize filename to prevent path traversal
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        
        // Generate unique filename with timestamp
        const timestamp = Date.now();
        const fileName = `${timestamp}_${sanitizedName}`;
        const filePath = join(uploadsDir, fileName);

        // Convert file to buffer and write to disk
        const bytes = await file.arrayBuffer();
        const buffer = new Uint8Array(bytes);
        await writeFile(filePath, buffer);

        // Validate documentType is a valid enum value
        const validDocumentType = 
          documentType === "MEDICAL_RECORD" ||
          documentType === "INSURANCE_CARD" ||
          documentType === "PRESCRIPTION" ||
          documentType === "ID" ||
          documentType === "OTHER"
            ? documentType
            : "OTHER";

        // Create document record in database
        const document = await prisma.document.create({
          data: {
            fileName: file.name,
            fileType: file.type || "application/octet-stream",
            fileSize: file.size,
            filePath: `/uploads/${intake.id}/${fileName}`,
            documentType: validDocumentType as any,
            intakeId: intake.id,
          },
        });

        uploadedDocuments.push(document);
      }
    }

    // Create audit log entry
    const auditLogData: {
      action: string;
      details: string | null;
      userId: string;
      intakeId: string;
    } = {
      action: "CREATED",
      details: JSON.stringify({
        status: "PENDING",
        documentCount: uploadedDocuments.length,
      }),
      userId: user.id,
      intakeId: intake.id,
    };

    await prisma.auditLog.create({
      data: auditLogData,
    });

    return NextResponse.json({
      success: true,
      intake: {
        id: intake.id,
        status: intake.status,
        createdAt: intake.createdAt,
      },
      documentsUploaded: uploadedDocuments.length,
    });
  } catch (error) {
    console.error("Intake creation error:", error);
    
    // Handle Prisma validation errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "An intake with this information already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create intake application" },
      { status: 500 }
    );
  }
}

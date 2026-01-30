import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  // TODO: Implement fetching intakes
  
  return NextResponse.json({ message: "TODO: Implement GET /api/intakes" });
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

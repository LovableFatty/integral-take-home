import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { getIntakeById, serializeIntakeDates, INTAKE_INCLUDE } from "@/lib/intake-queries";
import { Role, IntakeStatus } from "@prisma/client";
import { GetIntakeResponse, IntakeDetail } from "@/types/intake";
import { prisma } from "@/lib/prisma";
import { isAuthError, isForbiddenError } from "@/utils/errors";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id: intakeId } = await params;

    const intake = await getIntakeById(intakeId);

    if (!intake) {
      return NextResponse.json(
        { error: "Intake not found" },
        { status: 404 }
      );
    }

    // Check authorization: PATIENT can only see their own, REVIEWER can see all
    if (user.role === Role.PATIENT && intake.submittedById !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Convert Date objects to strings for JSON serialization
    const serializedIntake = serializeIntakeDates(intake) as IntakeDetail;

    return NextResponse.json<GetIntakeResponse>({ intake: serializedIntake });
  } catch (error) {
    console.error("Get intake error:", error);
    
    if (isAuthError(error)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch intake" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    // Only REVIEWER can update status
    const user = await requireRole([Role.REVIEWER]);
    const { id: intakeId } = await params;
    const body = await request.json();
    const { status, notes } = body;

    // Validate status
    if (!status || !Object.values(IntakeStatus).includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Get current intake
    const currentIntake = await prisma.intake.findUnique({
      where: { id: intakeId },
    });

    if (!currentIntake) {
      return NextResponse.json(
        { error: "Intake not found" },
        { status: 404 }
      );
    }

    // Update intake
    const updatedIntake = await prisma.intake.update({
      where: { id: intakeId },
      data: {
        status: status as IntakeStatus,
        reviewerId: user.id,
        notes: notes !== undefined ? notes : currentIntake.notes,
      },
      include: INTAKE_INCLUDE,
    });

    // Create audit log entry for status change
    await prisma.auditLog.create({
      data: {
        action: "STATUS_CHANGED",
        details: JSON.stringify({
          previousStatus: currentIntake.status,
          newStatus: status,
        }),
        userId: user.id,
        intakeId: intakeId,
      },
    });

    // Convert Date objects to strings for JSON serialization
    const serializedIntake = serializeIntakeDates(updatedIntake) as IntakeDetail;

    return NextResponse.json<GetIntakeResponse>({ intake: serializedIntake });
  } catch (error) {
    console.error("Update intake error:", error);
    
    if (isAuthError(error)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    if (isForbiddenError(error)) {
      return NextResponse.json(
        { error: "Forbidden - Only reviewers can update intake status" },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update intake" },
      { status: 500 }
    );
  }
}

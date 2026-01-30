import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getIntakeById } from "@/lib/intake-queries";
import { Role } from "@prisma/client";
import { GetIntakeResponse, IntakeDetail } from "@/types/intake";

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
    const serializedIntake: IntakeDetail = {
      ...intake,
      createdAt: intake.createdAt.toISOString(),
      updatedAt: intake.updatedAt.toISOString(),
    };

    return NextResponse.json<GetIntakeResponse>({ intake: serializedIntake });
  } catch (error) {
    console.error("Get intake error:", error);
    
    if (error instanceof Error && error.message === "Unauthorized") {
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
  const { id } = await params;
  
  // TODO: Implement updating intake
  
  return NextResponse.json({ message: `TODO: Implement PATCH /api/intakes/${id}` }, { status: 501 });
}

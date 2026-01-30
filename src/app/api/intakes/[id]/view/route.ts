import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { Role } from "@prisma/client";
import { isAuthError, isForbiddenError } from "@/utils/errors";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole([Role.REVIEWER]);
    const { id: intakeId } = await params;

    await prisma.auditLog.create({
      data: {
        action: "PRIVILEGED_VIEW_ACCESSED",
        details: JSON.stringify({ viewType: "privileged" }),
        userId: user.id,
        intakeId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Log privileged view error:", error);
    
    if (isAuthError(error)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (isForbiddenError(error)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    if (error instanceof Error && error.message.includes("Foreign key constraint")) {
      return NextResponse.json({ error: "Intake not found" }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: "Failed to log privileged view access" },
      { status: 500 }
    );
  }
}

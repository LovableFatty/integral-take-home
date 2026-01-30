import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { isAuthError } from "@/utils/errors";
import { AuditLogResponse } from "@/types/audit-log";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    
    const intakeId = new URL(request.url).searchParams.get("intakeId");

    const auditLogs = await prisma.auditLog.findMany({
      where: intakeId ? { intakeId } : undefined,
      include: {
        user: { select: { id: true, name: true, email: true } },
        intake: { select: { id: true, clientName: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const response: AuditLogResponse = {
      auditLogs: auditLogs.map((log) => ({
        id: log.id,
        action: log.action,
        details: log.details,
        createdAt: log.createdAt.toISOString(),
        user: log.user,
        intake: log.intake,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get audit logs error:", error);
    
    if (isAuthError(error)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}

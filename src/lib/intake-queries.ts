import { Role } from "@prisma/client";
import { prisma } from "./prisma";
import { IntakeWithRelations } from "@/types/intake";

const INTAKE_INCLUDE = {
  submittedBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  reviewer: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  documents: {
    select: {
      id: true,
      fileName: true,
      fileType: true,
      fileSize: true,
    },
  },
  _count: {
    select: {
      auditLogs: true,
    },
  },
} as const;

export async function getIntakesForUser(
  userId: string,
  role: Role
): Promise<IntakeWithRelations[]> {
  return prisma.intake.findMany({
    where: role === Role.PATIENT ? { submittedById: userId } : {},
    include: INTAKE_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}

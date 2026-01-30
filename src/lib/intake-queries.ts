import { Role, Prisma } from "@prisma/client";
import { prisma } from "./prisma";

const USER_SELECT = {
  name: true,
  email: true,
} as const;

const INTAKE_INCLUDE = {
  submittedBy: { select: USER_SELECT },
  reviewer: { select: USER_SELECT },
  documents: {
    select: {
      id: true,
      fileName: true,
      documentType: true,
    },
  },
} as const;

// Type for intake with relations (matches INTAKE_INCLUDE)
export type IntakeWithRelations = Prisma.IntakeGetPayload<{
  include: typeof INTAKE_INCLUDE;
}>;

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

export async function getIntakeById(intakeId: string) {
  return prisma.intake.findUnique({
    where: { id: intakeId },
    include: INTAKE_INCLUDE,
  });
}

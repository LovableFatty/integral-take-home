import { Prisma } from "@prisma/client";

// Prisma type for Intake with relations
export type IntakeWithRelations = Prisma.IntakeGetPayload<{
  include: {
    submittedBy: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    reviewer: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    documents: {
      select: {
        id: true;
        fileName: true;
        fileType: true;
        fileSize: true;
      };
    };
    _count: {
      select: {
        auditLogs: true;
      };
    };
  };
}>;

// API Response types
export interface GetIntakesResponse {
  intakes: IntakeWithRelations[];
}

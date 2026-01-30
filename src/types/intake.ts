export type { IntakeWithRelations } from "@/lib/intake-queries";

// Document type (matches what's returned from INTAKE_INCLUDE)
export interface Document {
  id: string;
  fileName: string;
  documentType: string;
}


export type IntakeDetail = Omit<IntakeWithRelations, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

// API Response type for GET /api/intakes/[id]
export interface GetIntakeResponse {
  intake: IntakeDetail;
}

export interface GetIntakesResponse {
  intakes: IntakeWithRelations[];
}

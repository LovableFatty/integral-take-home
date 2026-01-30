import { IntakeStatus } from "@prisma/client";
import { IntakeWithRelations } from "@/types/intake";

export function filterIntakes(
  intakes: IntakeWithRelations[],
  statusFilter: IntakeStatus | "ALL",
  searchQuery: string
): IntakeWithRelations[] {
  return intakes.filter((intake) => {
    if (statusFilter !== "ALL" && intake.status !== statusFilter) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        intake.id.toLowerCase().includes(query) ||
        intake.clientName.toLowerCase().includes(query) ||
        intake.clientEmail.toLowerCase().includes(query)
      );
    }

    return true;
  });
}

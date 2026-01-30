import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { Role } from "@prisma/client";
import AuditTrailList from "@/components/AuditTrailList";
import DashboardHeader from "@/components/DashboardHeader";

export const metadata: Metadata = {
  title: "Audit Trail | Enrollment Application System",
  description: "View all actions taken on intake submissions for compliance and audit purposes",
};

export default async function AuditTrailPage(): Promise<JSX.Element> {
  try {
    await requireRole([Role.REVIEWER]);

    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6 sm:py-8">
          <header className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Audit Trail
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              View all actions taken on intake submissions for compliance
            </p>
          </header>

          <AuditTrailList />
        </main>
      </div>
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
        console.error("Audit trail page error:", {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        });
      }
    } else {
      console.error("Audit trail page error:", {
        error: "Unknown error",
        timestamp: new Date().toISOString(),
      });
    }

    redirect("/login");
  }
}

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { Role } from "@prisma/client";
import QueueList from "@/components/QueueList";

export default async function QueuePage() {
  try {
    await requireRole([Role.REVIEWER]);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Review Queue
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage and review client intake submissions
            </p>
          </div>

          <QueueList />
        </div>
      </div>
    );
  } catch (error) {
    redirect("/login");
  }
}

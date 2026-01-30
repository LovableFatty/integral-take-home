import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { Role } from "@prisma/client";
import IntakeForm from "@/components/IntakeForm";

export default async function IntakePage() {
  try {
    const user = await requireRole([Role.PATIENT]);

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8 w-full max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Enrollment Application
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Submit your enrollment application for clinical trial review
          </p>
        </div>

        <IntakeForm userId={user.id} />
      </div>
    );
  } catch (error) {
    // Redirect to login if unauthorized
    redirect("/login");
  }
}

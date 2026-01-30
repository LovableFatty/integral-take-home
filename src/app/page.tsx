import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@prisma/client";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === Role.PATIENT) {
    redirect("/intake");
  }

  if (user.role === Role.REVIEWER) {
    redirect("/queue");
  }

  redirect("/login");
}

import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  organization: string;
}

/**
 * Get the current authenticated user from the session cookie.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;

    if (!sessionId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organization: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Require authentication. Throws an error if user is not authenticated.
 * @throws {Error} If user is not authenticated
 */
export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Require specific role(s). Throws an error if user doesn't have required role.
 * @param allowedRoles - Array of roles that are allowed
 * @throws {Error} If user is not authenticated or doesn't have required role
 */
export async function requireRole(
  allowedRoles: Role[]
): Promise<CurrentUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}

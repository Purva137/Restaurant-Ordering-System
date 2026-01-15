import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export async function requireRole(allowedRoles: string[]) {
  const authResult = await auth();
  const userId = authResult?.userId;

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user; // useful later
}

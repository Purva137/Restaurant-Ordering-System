// app/lib/auth.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

// Core auth functions
export async function requireAuth() {
  try {
    const authResult = await auth();
    const userId = authResult?.userId;
    
    if (!userId) {
      throw new Error("UNAUTHENTICATED");
    }
    
    return userId;
  } catch (error: any) {
    // If it's already our UNAUTHENTICATED error, re-throw it
    if (error?.message === "UNAUTHENTICATED") {
      throw error;
    }
    
    // Handle any other errors (middleware detection, network issues, etc.)
    // Treat all as unauthenticated
    throw new Error("UNAUTHENTICATED");
  }
}

export async function getCurrentUser() {
  const userId = await requireAuth();

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      const clerkUser = await currentUser();
      if (!clerkUser) {
        throw new Error("UNAUTHENTICATED");
      }

      const email =
        clerkUser.emailAddresses?.[0]?.emailAddress ?? null;
      const name =
        clerkUser.fullName ??
        clerkUser.firstName ??
        clerkUser.username ??
        null;

      const adminEmails = (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);

      const role = email && adminEmails.includes(email.toLowerCase())
        ? "ADMIN"
        : "STAFF";

      return await prisma.user.create({
        data: {
          clerkId: userId,
          name,
          email,
          role,
        },
      });
    }

    if (user.role !== "ADMIN") {
      const adminEmails = (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);

      if (adminEmails.length > 0) {
        const clerkUser = await currentUser();
        const email =
          clerkUser?.emailAddresses?.[0]?.emailAddress ?? user.email;

        if (email && adminEmails.includes(email.toLowerCase())) {
          return await prisma.user.update({
            where: { id: user.id },
            data: { role: "ADMIN" },
          });
        }
      }
    }

    return user;
  } catch (error: any) {
    // If it's already our error, re-throw
    if (error?.message === "UNAUTHENTICATED") {
      throw error;
    }
    
    // Check if it's a Prisma initialization error (all P1xxx codes are initialization errors)
    // Also check for the specific error message pattern
    const isPrismaInitError = 
      error?.name === "PrismaClientInitializationError" || 
      (error?.code && typeof error.code === "string" && error.code.startsWith("P1")) ||
      (error?.message && typeof error.message === "string" && (
        error.message.includes("Invalid") && error.message.includes("invocation") ||
        error.message.includes("PrismaClientInitializationError")
      ));
    
    if (isPrismaInitError) {
      console.error("Prisma initialization error detected:", {
        name: error?.name,
        code: error?.code,
        message: error?.message,
        stack: error?.stack?.split('\n').slice(0, 3).join('\n'),
      });
      console.error("\n⚠️  To fix this error:");
      console.error("1. Stop the development server (Ctrl+C)");
      console.error("2. Run: npx prisma generate");
      console.error("3. Ensure DATABASE_URL is set in .env");
      console.error("4. Restart the development server\n");
      throw new Error("UNAUTHENTICATED");
    }
    
    // Database errors should also be treated as unauthenticated for security
    console.error("Database error in getCurrentUser:", error);
    throw new Error("UNAUTHENTICATED");
  }
}

export async function requireRole(roles: ("ADMIN" | "STAFF")[]) {
  const user = await getCurrentUser();

  if (!roles.includes(user.role as any)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}

// Page helpers (redirect on error)
export async function requireRolePage(roles: ("ADMIN" | "STAFF")[]) {
  try {
    return await requireRole(roles);
  } catch (error: any) {
    // Next.js redirect() throws a special error object with a digest property
    // If this is already a redirect error, let it propagate
    if (error && typeof error === 'object' && 'digest' in error) {
      const digest = String(error.digest || '');
      if (digest.includes('NEXT_REDIRECT')) {
        throw error;
      }
    }
    
    // For any auth/forbidden errors, redirect to home
    const errorMessage = String(error?.message || error || "");
    if (
      errorMessage === "UNAUTHENTICATED" || 
      errorMessage === "FORBIDDEN"
    ) {
      redirect("/");
    }
    
    // For any other error (including clerkMiddleware errors), redirect to be safe
    redirect("/");
  }
}

// API helpers (return JSON error responses)
export async function requireRoleApi(roles: ("ADMIN" | "STAFF")[]) {
  try {
    return await requireRole(roles);
  } catch (error: any) {
    throw error; // Let API routes handle the error response
  }
}

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (userId) {
      // Check if user exists in database, if not create with ADMIN role
      try {
        let user = await prisma.user.findUnique({
          where: { clerkId: userId },
        });

        // If user doesn't exist, create one with ADMIN role (first user setup)
        if (!user) {
          user = await prisma.user.create({
            data: {
              clerkId: userId,
              role: "ADMIN", // First user becomes admin
            },
          });
        }
      } catch (dbError) {
        console.error("Database error in SSO callback:", dbError);
        // Continue anyway, redirect to admin
      }
      
      // User is authenticated, redirect to admin
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    
    // If not authenticated, redirect to sign-in
    return NextResponse.redirect(new URL("/sign-in", request.url));
  } catch (error) {
    console.error("SSO callback error:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}


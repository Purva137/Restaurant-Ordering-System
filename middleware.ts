import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {
  const host = req.headers.get("host") ?? "";
  const isAdminHost = host.startsWith("admin.");

  if (isAdminHost) {
    const url = req.nextUrl;
    const isAdminPath = url.pathname.startsWith("/admin");
    if (!isAdminPath) {
      const targetPath =
        url.pathname === "/" ? "/admin" : `/admin${url.pathname}`;
      const target = new URL(`${targetPath}${url.search}`, req.url);
      return NextResponse.rewrite(target);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};


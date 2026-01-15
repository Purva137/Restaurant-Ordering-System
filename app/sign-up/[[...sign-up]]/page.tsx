"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <p className="text-white/80 text-sm mb-2">
            ⚡ Quick Tip: Use Google/Apple sign-in to skip phone verification
          </p>
        </div>
        <SignUp 
          routing="path"
          path="/sign-up"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-[#1b070b] border border-white/10",
            },
          }}
          signInUrl="/sign-in"
          afterSignUpUrl="/admin"
        />
        <p className="text-center text-white/60 text-xs mt-4">
          Phone number is optional. You can skip it if email-only sign-up is enabled in Clerk dashboard.
        </p>
      </div>
    </div>
  );
}

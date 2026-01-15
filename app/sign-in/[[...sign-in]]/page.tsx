"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <SignIn 
        routing="path"
        path="/sign-in"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-[#1b070b] border border-white/10",
          },
        }}
        signUpUrl="/sign-up"
        afterSignInUrl="/admin"
      />
    </div>
  );
}


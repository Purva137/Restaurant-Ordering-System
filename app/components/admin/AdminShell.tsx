"use client";

import Link from "next/link";
import { UserButton, useAuth, useClerk } from "@clerk/nextjs";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth();
  const clerk = useClerk();

  return (
    <div className="min-h-screen flex bg-[#0e0e0e] text-white">
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="tracking-widest text-sm">NOBORU ADMIN</h2>
        </div>

        <nav className="flex flex-col gap-4 text-sm flex-1">
          <Link href="/admin" className="hover:text-white/80 transition">
            Dashboard
          </Link>
          <Link href="/admin/kitchen" className="hover:text-white/80 transition">
            Kitchen
          </Link>
          <Link href="/admin/staff" className="hover:text-white/80 transition">
            Staff
          </Link>
          <Link href="/admin/reservations" className="hover:text-white/80 transition">
            Reservations
          </Link>
          <Link href="/admin/tables" className="hover:text-white/80 transition">
            Tables
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          {isLoaded && userId && (
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition group"
              onClick={(e) => {
                // Find and click the UserButton's trigger button
                const userButton = (e.currentTarget.querySelector('button[type="button"]') || 
                                  e.currentTarget.querySelector('[data-clerk-element="userButton"]') ||
                                  e.currentTarget.querySelector('button')) as HTMLElement;
                if (userButton) {
                  userButton.click();
                }
              }}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <UserButton 
                  appearance={{
                    variables: {
                      colorBackground: "#fbf6eb",
                      colorText: "black",
                      colorTextSecondary: "black",
                    },
                    elements: {
                      avatarBox: "w-10 h-10 border-2 border-white/20",
                      userButtonPopoverCard: "bg-[#1a1a1a] border border-white/20 shadow-lg",
                    },
                  }}
                />
              </div>
              <span className="text-xs text-white/60 group-hover:text-white transition">Account</span>
            </div>
          )}
          {isLoaded && !userId && (
            <div className="text-xs text-white/60">Not signed in</div>
          )}
        </div>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

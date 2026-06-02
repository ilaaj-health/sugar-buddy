"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { ChevronRight, LayoutDashboard, LogOut } from "lucide-react";
import { LogoMark } from "./Logo";

interface NavbarProps {
  activePage?: "home" | "faq" | "pricing";
}

export function Navbar({ activePage }: NavbarProps) {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const pfpUrl = user?.imageUrl;
  const initials = user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark size={34} />
          <span className="text-xl font-bold text-primary">Sugar Buddy</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-zinc-500">
          <a href={activePage === "home" ? "#features" : "/#features"} className="hover:text-zinc-900 transition-colors">Features</a>
          <a href={activePage === "home" ? "#how" : "/#how"} className="hover:text-zinc-900 transition-colors">How it works</a>
          <Link href="/pricing" className={`hover:text-zinc-900 transition-colors ${activePage === "pricing" ? "text-primary font-medium" : ""}`}>Pricing</Link>
          <Link href="/faq" className={`hover:text-zinc-900 transition-colors ${activePage === "faq" ? "text-primary font-medium" : ""}`}>FAQ</Link>
        </nav>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
                {pfpUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pfpUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-primary/30" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold border-2 border-primary/30">{initials}</div>
                )}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-100 rounded-xl shadow-lg py-1 z-50">
                  <div className="px-4 py-2.5 border-b border-zinc-50">
                    <p className="text-sm font-medium text-zinc-900 truncate">{user?.firstName || "User"}</p>
                    <p className="text-xs text-zinc-400 truncate">{user?.emailAddresses?.[0]?.emailAddress}</p>
                  </div>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors">
                    <LayoutDashboard className="w-4 h-4 text-zinc-400" /> Dashboard
                  </Link>
                  <button onClick={() => { setMenuOpen(false); signOut({ redirectUrl: "/" }); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/signup" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors shadow-sm">
              Shuru Karein <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

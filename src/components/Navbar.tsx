"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { ChevronRight, LayoutDashboard, LogOut, Menu, X, CreditCard, HelpCircle, Mail, FileText, User, Home } from "lucide-react";
import { LogoMark } from "./Logo";
import { usePathname } from "next/navigation";

interface NavbarProps {
  activePage?: "home" | "faq" | "pricing";
}

const MOBILE_NAV = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/pricing", label: "Pricing", Icon: CreditCard },
  { href: "/faq", label: "FAQ", Icon: HelpCircle },
  { href: "/contact", label: "Contact", Icon: Mail },
  { href: "/privacy", label: "Privacy Policy", Icon: FileText },
  { href: "/terms", label: "Terms of Service", Icon: FileText },
];

export function Navbar({ activePage }: NavbarProps) {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const pfpUrl = user?.imageUrl;
  const initials = user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U";

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Mobile hamburger */}
          <button onClick={() => setDrawerOpen(true)} className="sm:hidden p-1.5 -ml-1.5 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-50">
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <LogoMark size={30} />
            <span className="text-lg sm:text-xl font-bold text-primary">Sugar Buddy</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-6 text-sm text-zinc-500">
            <a href={activePage === "home" ? "#features" : "/#features"} className="hover:text-zinc-900 transition-colors">Features</a>
            <a href={activePage === "home" ? "#how" : "/#how"} className="hover:text-zinc-900 transition-colors">How it works</a>
            <Link href="/pricing" className={`hover:text-zinc-900 transition-colors ${activePage === "pricing" ? "text-primary font-medium" : ""}`}>Pricing</Link>
            <Link href="/faq" className={`hover:text-zinc-900 transition-colors ${activePage === "faq" ? "text-primary font-medium" : ""}`}>FAQ</Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
                  {pfpUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pfpUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-primary/30" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold border-2 border-primary/30">{initials}</div>
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
                <span className="hidden sm:inline">Shuru Karein</span>
                <span className="sm:hidden text-xs">Join</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 sm:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col transform transition-transform duration-300 ease-in-out sm:hidden ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2">
            <LogoMark size={28} />
            <span className="text-base font-bold text-primary">Sugar Buddy</span>
          </Link>
          <button onClick={() => setDrawerOpen(false)} className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User section */}
        {isSignedIn && (
          <div className="px-5 py-4 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              {pfpUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pfpUrl} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">{initials}</div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900 truncate">{user?.firstName || "User"}</p>
                <p className="text-xs text-zinc-400 truncate">{user?.emailAddresses?.[0]?.emailAddress}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {MOBILE_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setDrawerOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? "bg-primary-light text-primary" : "text-zinc-600 hover:bg-zinc-50"}`}>
                <item.Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}

          {isSignedIn && (
            <>
              <div className="h-px bg-zinc-100 my-3" />
              <Link href="/dashboard" onClick={() => setDrawerOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${pathname.startsWith("/dashboard") ? "bg-primary-light text-primary" : "text-zinc-600 hover:bg-zinc-50"}`}>
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                Dashboard
              </Link>
            </>
          )}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-zinc-100">
          {isSignedIn ? (
            <button onClick={() => { setDrawerOpen(false); signOut({ redirectUrl: "/" }); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="w-4 h-4 shrink-0" />
              Log Out
            </button>
          ) : (
            <Link href="/signup" onClick={() => setDrawerOpen(false)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors">
              <User className="w-4 h-4" />
              Shuru Karein — Join Free
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { Home, FileText, BarChart2, Bot, Pill, Users, Settings, LogOut } from "lucide-react";
import { LogoMark } from "@/components/Logo";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/log", label: "Reading Log", icon: FileText },
  { href: "/trends", label: "Trends", icon: BarChart2 },
  { href: "/copilot", label: "AI Chat", icon: Bot },
  { href: "/medicines", label: "Medicines", icon: Pill },
  { href: "/family", label: "Family", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-zinc-100 flex-col">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-zinc-100">
          <Link href="/" className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity">
            <LogoMark size={34} />
            <span className="text-xl font-bold text-primary truncate">Sugar Buddy</span>
          </Link>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-primary-light text-primary" : "text-text-secondary hover:bg-zinc-50 hover:text-zinc-900"
                }`}>
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-3 border-t border-zinc-100">
          <SignOutButton redirectUrl="/login">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-danger transition-colors">
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log Out</span>
            </button>
          </SignOutButton>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-60">
        {/* Mobile top bar */}
        <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-zinc-100 md:hidden">
          <div className="flex items-center justify-center px-4 h-12">
            <Link href="/" className="flex items-center gap-1.5 font-bold text-zinc-900">
              <LogoMark size={28} />
              <span className="text-sm">Sugar Buddy</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex flex-col pt-12 pb-16 md:pt-0 md:pb-0 min-w-0">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-zinc-100 md:hidden safe-bottom">
          <div className="flex items-center">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className={`flex flex-col items-center justify-center py-2 min-w-0 flex-1 text-[10px] font-medium transition-colors gap-0.5 ${
                    isActive ? "text-primary" : "text-text-secondary"
                  }`}>
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="truncate leading-none">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

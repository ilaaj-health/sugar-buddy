import Link from "next/link";
import { LogoMark } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 overflow-hidden">
        {/* Mobile: simple stacked | Desktop: 4-col grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          {/* Brand — full width on mobile */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <LogoMark size={24} />
              <span className="text-sm font-bold text-primary">Sugar Buddy</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
              Smart glucose tracker for diabetes patients.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Navigation</p>
            <ul className="space-y-1.5">
              {[
                { label: "Home", href: "/" },
                { label: "Pricing", href: "/pricing" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Legal</p>
            <ul className="space-y-1.5">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-zinc-400">&copy; {new Date().getFullYear()} Sugar Buddy. All rights reserved.</p>
          <p className="text-[10px] text-zinc-400">Not a medical device. Consult your doctor.</p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { CheckCircle2, X, Zap, Crown, Loader2 } from "lucide-react";

const FREE_FEATURES = [
  { text: "5 readings per month", included: true },
  { text: "Basic AI tashreeh", included: true },
  { text: "7-day trends", included: true },
  { text: "AI Chat — 10 messages/month", included: true },
  { text: "Safety alerts", included: true },
  { text: "Unlimited readings", included: false },
  { text: "90-day trends & stats", included: false },
  { text: "Unlimited AI Chat", included: false },
  { text: "Export readings (CSV)", included: false },
];

const PRO_FEATURES = [
  { text: "Unlimited readings", included: true },
  { text: "Advanced AI tashreeh", included: true },
  { text: "90-day trends & detailed stats", included: true },
  { text: "Unlimited AI Chat", included: true },
  { text: "Priority AI responses", included: true },
  { text: "Export readings (CSV)", included: true },
  { text: "Priority support", included: true },
  { text: "Early access to new features", included: true },
];

export default function PricingPage() {
  return (
    <Suspense>
      <PricingContent />
    </Suspense>
  );
}

function PricingContent() {
  const { isSignedIn, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const autoTriggered = useRef(false);

  // Fetch user plan
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetch("/api/stripe/plan").then(r => r.json()).then(d => setUserPlan(d.plan)).catch(() => {});
    }
  }, [isLoaded, isSignedIn]);

  const isPro = userPlan === "pro";

  // Auto-redirect to Stripe if user just signed up and came back with ?auto=true
  useEffect(() => {
    if (isLoaded && isSignedIn && searchParams.get("auto") === "true" && !autoTriggered.current) {
      autoTriggered.current = true;
      handleUpgrade();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, searchParams]);

  async function handleUpgrade() {
    if (!isSignedIn) {
      window.location.href = "/signup#/?redirect_url=/pricing?auto=true";
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar activePage="pricing" />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Pricing</p>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-4">Sasti aur Asaan Plans</h1>
            <p className="text-zinc-500 text-lg">Simple pricing — no hidden fees. Start free, upgrade when you need more.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-7 flex flex-col">
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-zinc-500" />
                  <h3 className="text-lg font-bold text-zinc-900">Free</h3>
                </div>
                <p className="text-sm text-zinc-500">Shuru karne ke liye</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-black text-zinc-900">Rs 0</span>
                <span className="text-sm text-zinc-400">/month</span>
                <p className="text-xs text-zinc-400 mt-1">Hamesha free</p>
              </div>
              <Link href="/signup" className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-zinc-700 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-colors mb-6">
                Shuru Karein
              </Link>
              <ul className="space-y-3 flex-1">
                {FREE_FEATURES.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5">
                    {f.included ? <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> : <X className="w-4 h-4 text-zinc-300 mt-0.5 shrink-0" />}
                    <span className={`text-sm ${f.included ? "text-zinc-700" : "text-zinc-400"}`}>{f.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-white border-2 border-primary rounded-2xl p-7 flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" /> Popular
              </div>
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-zinc-900">Pro</h3>
                </div>
                <p className="text-sm text-zinc-500">Sab kuch unlimited</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-black text-zinc-900">Rs 1,000</span>
                <span className="text-sm text-zinc-400">/month</span>
                <p className="text-xs text-zinc-400 mt-1">Cancel anytime</p>
              </div>
              {isPro ? (
                <div className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-primary bg-primary-light rounded-xl mb-6">
                  <CheckCircle2 className="w-4 h-4" /> Aap ka Active Plan
                </div>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-colors shadow-lg shadow-primary/25 mb-6"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting...</> : <><Zap className="w-4 h-4" /> Pro Shuru Karein</>}
                </button>
              )}
              <ul className="space-y-3 flex-1">
                {PRO_FEATURES.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-zinc-700">{f.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-400 mt-8">
            Dono plans mein safety alerts aur Roman Urdu support shamil hain.
          </p>
        </div>
      </main>
    </div>
  );
}

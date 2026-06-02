"use client";
import { useState } from "react";
import Link from "next/link";
import { Crown, Zap, Loader2, ExternalLink } from "lucide-react";

export function PlanCard({ plan, hasStripe }: { plan: string; hasStripe: boolean }) {
  const [loading, setLoading] = useState(false);
  const isPro = plan === "pro";
  async function openPortal() { setLoading(true); try { const res = await fetch("/api/stripe/portal", { method: "POST" }); const data = await res.json(); if (data.url) window.location.href = data.url; } catch {} finally { setLoading(false); } }

  return (
    <div className={`rounded-xl border p-4 mb-6 ${isPro ? "border-primary bg-emerald-50" : "border-zinc-200 bg-white"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isPro ? <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center"><Crown className="w-4 h-4 text-white" /></div> : <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-zinc-500" /></div>}
          <div><p className="text-sm font-semibold text-zinc-900">{isPro ? "Pro Plan" : "Free Plan"}</p><p className="text-xs text-zinc-500">{isPro ? "Rs 1,000/month — Unlimited" : "5 readings/month — Basic"}</p></div>
        </div>
        {isPro && hasStripe ? (<button onClick={openPortal} disabled={loading} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">{loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ExternalLink className="w-3 h-3" />} Manage</button>) : !isPro ? (<Link href="/pricing" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"><Crown className="w-3 h-3" /> Upgrade</Link>) : null}
      </div>
    </div>
  );
}

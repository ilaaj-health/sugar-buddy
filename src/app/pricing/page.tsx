import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { CheckCircle2, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    nameUr: "Muft",
    price: "Rs 0",
    period: "/month",
    desc: "Shuru karne ke liye bilkul free.",
    features: [
      "30 readings per month",
      "AI tashreeh (explanation)",
      "90-day trends",
      "5 AI Chat messages/month",
      "Safety alerts",
    ],
    cta: "Muft Shuru Karein",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    nameUr: "Pro",
    price: "Rs 500",
    period: "/month",
    desc: "Diabetes management ke liye sab kuch.",
    features: [
      "Unlimited readings",
      "AI tashreeh (explanation)",
      "90-day trends",
      "Unlimited AI Chat",
      "Safety alerts",
      "Priority support",
      "Export data (CSV)",
    ],
    cta: "Pro Lein",
    href: "/signup",
    highlighted: true,
  },
];

function PlanCard({
  plan,
}: {
  plan: (typeof plans)[number];
}) {
  return (
    <div
      className={`relative bg-white rounded-2xl border p-7 flex flex-col ${
        plan.highlighted
          ? "border-primary shadow-xl shadow-primary/10 ring-2 ring-primary/20"
          : "border-zinc-100"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
          Popular
        </div>
      )}
      <div className="mb-5">
        <h3 className="text-lg font-bold text-zinc-900">
          {plan.name}{" "}
          <span className="text-sm font-normal text-zinc-400">({plan.nameUr})</span>
        </h3>
        <p className="text-sm text-zinc-500 mt-1">{plan.desc}</p>
      </div>
      <div className="mb-6">
        <span className="text-4xl font-black text-zinc-900">{plan.price}</span>
        <span className="text-sm text-zinc-400">{plan.period}</span>
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span className="text-sm text-zinc-600">{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={plan.href}
        className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl transition-colors ${
          plan.highlighted
            ? "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
        }`}
      >
        {plan.highlighted && <Zap className="w-4 h-4" />}
        {plan.cta}
      </Link>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar activePage="pricing" />
      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Pricing</p>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-4">Sasta aur Aasaan</h1>
            <p className="text-zinc-500 text-lg">Simple pricing for everyone. No hidden fees.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {plans.map((plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ))}
          </div>
          <p className="text-center text-xs text-zinc-400 mt-8">
            Sab plans mein safety alerts aur Roman Urdu explanations shamil hain.
          </p>
        </div>
      </main>
    </div>
  );
}

import { Navbar } from "@/components/Navbar";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Sugar Buddy kya hai?",
    a: "Sugar Buddy ek smart glucose tracker hai jo diabetes patients ke liye bana hai. Aap apni sugar readings log kar sakte hain, AI se Roman Urdu mein tashreeh (explanation) le sakte hain, aur apne trends dekh sakte hain.",
  },
  {
    q: "Kya yeh doctors ki jagah kaam karta hai?",
    a: "Nahi. Sugar Buddy sirf educational aur tracking tool hai. Yeh tibbi mashwarah (medical advice) nahi deta. Hamesha apne doctor se mashwarah karein.",
  },
  {
    q: "Kya mera data safe hai?",
    a: "Haan. Aapka data encrypted hai aur sirf aap dekh sakte hain. Hum kisi ke saath aapka data share nahi karte.",
  },
  {
    q: "AI Chat kya karta hai?",
    a: "AI Chat aapke diabetes se related sawalat ka jawab deta hai Roman Urdu mein — jaise khoraak, warzish, HbA1c, dawai ka waqt waghaira. Yeh general guidance hai, doctor ki jagah nahi.",
  },
  {
    q: "Kya yeh free hai?",
    a: "Haan, free plan mein aap har mahine 30 readings log kar sakte hain, trends dekh sakte hain, aur limited AI chat use kar sakte hain. Zyada features ke liye Pro plan hai.",
  },
  {
    q: "Kaun si readings log kar sakta hoon?",
    a: "Aap 4 tarah ki readings log kar sakte hain: Fasting (khaali pet), Post-meal (khaane ke baad), Random, aur Bedtime (sone se pehle).",
  },
  {
    q: "Kya phone par kaam karta hai?",
    a: "Haan. Sugar Buddy mobile-friendly hai aur har device par kaam karta hai — phone, tablet, ya computer.",
  },
  {
    q: "Safety Gate kya hai?",
    a: "Agar aapki reading khatarnaak range mein jaaye (bohat zyada ya bohat kam), to Sugar Buddy foran alert deta hai aur doctor se rabta karne ka mashwarah deta hai.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group bg-white rounded-xl border border-zinc-100 overflow-hidden">
      <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none hover:bg-zinc-50 transition-colors">
        <span className="text-sm font-semibold text-zinc-900">{q}</span>
        <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-4 text-sm text-zinc-600 leading-relaxed">{a}</div>
    </details>
  );
}

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar activePage="faq" />
      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">FAQ</p>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-4">Aksar Poochhe Jaane Waale Sawalaat</h1>
            <p className="text-zinc-500 text-lg">Frequently Asked Questions</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

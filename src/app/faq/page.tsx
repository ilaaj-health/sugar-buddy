import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Animate } from "@/components/Animate";
import { ChevronDown, Activity, Bot, BarChart2, ShieldCheck, CreditCard, Smartphone, HelpCircle, Zap } from "lucide-react";

const categories = [
  {
    title: "App ke Baare Mein",
    titleEn: "About the App",
    icon: HelpCircle,
    color: "text-primary",
    bg: "bg-emerald-50",
    faqs: [
      { q: "Sugar Buddy kya hai?", a: "Sugar Buddy ek smart glucose tracker hai jo diabetes patients ke liye bana hai. Aap apni sugar readings log kar sakte hain, AI se Roman Urdu mein tashreeh le sakte hain, aur apne trends dekh sakte hain." },
      { q: "Kya yeh doctors ki jagah kaam karta hai?", a: "Nahi. Sugar Buddy sirf educational aur tracking tool hai. Yeh tibbi mashwarah nahi deta. Hamesha apne doctor se mashwarah karein." },
      { q: "Kya mera data safe hai?", a: "Haan. Aapka data encrypted hai aur sirf aap dekh sakte hain. Hum kisi ke saath aapka data share nahi karte." },
    ],
  },
  {
    title: "Features",
    titleEn: "Features & Usage",
    icon: Activity,
    color: "text-blue-600",
    bg: "bg-blue-50",
    faqs: [
      { q: "AI Chat kya karta hai?", a: "AI Chat aapke diabetes se related sawalat ka jawab deta hai Roman Urdu mein — jaise khoraak, warzish, HbA1c waghaira. Yeh general guidance hai, doctor ki jagah nahi." },
      { q: "Kaun si readings log kar sakta hoon?", a: "Aap 4 tarah ki readings log kar sakte hain: Fasting (khaali pet), Post-meal (khaane ke baad), Random, aur Bedtime (sone se pehle)." },
      { q: "Trends kya dikhata hai?", a: "Trends page aapki pichli readings ka graph dikhata hai — ausat, highest, lowest, aur kitni readings normal range mein thin. Aap 7, 30, ya 90 din ka data dekh sakte hain." },
    ],
  },
  {
    title: "Safety",
    titleEn: "Safety & Alerts",
    icon: ShieldCheck,
    color: "text-red-600",
    bg: "bg-red-50",
    faqs: [
      { q: "Safety Gate kya hai?", a: "Agar aapki reading khatarnaak range mein jaaye (70 se kam ya 300 se zyaada), to Sugar Buddy foran alert deta hai aur doctor se rabta karne ka mashwarah deta hai. Yeh automatic hai." },
      { q: "AI galat jawab de toh?", a: "AI hamesha 100% sahi nahi hota. Koi bhi AI jawab ko medical advice na samjhein. AI kabhi insulin dose ya dawai change nahi batata — agar aisa kare toh follow mat karein." },
    ],
  },
  {
    title: "Plans & Payment",
    titleEn: "Pricing & Billing",
    icon: CreditCard,
    color: "text-amber-600",
    bg: "bg-amber-50",
    faqs: [
      { q: "Kya yeh free hai?", a: "Haan, free plan mein aap har mahine readings log kar sakte hain, trends dekh sakte hain, aur limited AI chat use kar sakte hain. Zyada features ke liye Pro plan hai." },
      { q: "Pro plan kaise cancel karein?", a: "Settings mein ja kar kisi bhi waqt cancel kar sakte hain. Koi hidden charges nahi. Cancel karne ke baad month ke end tak access rahega." },
      { q: "Payment methods kya hain?", a: "Visa, Mastercard — Stripe ke zariye secure payment. Aapki card info humare server par nahi aati." },
    ],
  },
  {
    title: "Technical",
    titleEn: "Technical Questions",
    icon: Smartphone,
    color: "text-violet-600",
    bg: "bg-violet-50",
    faqs: [
      { q: "Kya phone par kaam karta hai?", a: "Haan. Sugar Buddy mobile-friendly hai aur har device par kaam karta hai — phone, tablet, ya computer. Home screen par add karne ke liye browser mein 'Add to Home Screen' use karein." },
      { q: "Streaks kya hain?", a: "Har din reading log karne se aapka streak badhta hai. Miss karne par reset ho jata hai. Badges milte hain — 7 din, 30 din, 100 din milestones par." },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar activePage="faq" />
      <HeroSection tag="FAQ" title="Aksar Poochhe Jaane Waale Sawalaat" subtitle="Frequently Asked Questions — jawab mil jayega!" />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="space-y-10">
          {categories.map((cat, ci) => {
            const Icon = cat.icon;
            return (
              <Animate key={cat.title} type="fadeUp" delay={ci * 80}>
                <div>
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 ${cat.bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${cat.color}`} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-zinc-900">{cat.title}</h2>
                      <p className="text-xs text-zinc-400">{cat.titleEn}</p>
                    </div>
                  </div>

                  {/* FAQ items */}
                  <div className="space-y-2 ml-12">
                    {cat.faqs.map((faq) => (
                      <details key={faq.q} className="group bg-white rounded-xl border border-zinc-100 overflow-hidden hover:border-primary/30 transition-colors">
                        <summary className="flex items-center justify-between gap-4 px-5 py-3.5 cursor-pointer list-none select-none hover:bg-zinc-50 transition-colors">
                          <span className="text-sm font-medium text-zinc-900">{faq.q}</span>
                          <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="px-5 pb-4 text-sm text-zinc-600 leading-relaxed border-t border-zinc-50 pt-3">{faq.a}</div>
                      </details>
                    ))}
                  </div>
                </div>
              </Animate>
            );
          })}
        </div>

        {/* CTA */}
        <Animate type="fadeUp" delay={100}>
          <div className="mt-14 p-8 bg-emerald-50 border border-emerald-100 rounded-3xl text-center">
            <Bot className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Aur koi sawal?</h3>
            <p className="text-sm text-zinc-500 mb-6">AI Chat se poochein ya humse raabta karein.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors">
                <Zap className="w-4 h-4" /> Shuru Karein
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </Animate>
      </main>

      <Footer />
    </div>
  );
}

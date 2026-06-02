import Link from "next/link";
import { Activity, Bot, BarChart2, Bell, ShieldCheck, CheckCircle2, AlertTriangle, Heart, Zap, ChevronRight } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";

function HeroReadingCard() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-3xl" />
      <div className="relative bg-white rounded-3xl shadow-2xl p-6 border border-zinc-100">
        <div className="flex items-center justify-between mb-5">
          <div><p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Latest Reading</p><p className="text-sm text-zinc-500 mt-0.5">Aaj, 8:30 AM</p></div>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Normal</span>
        </div>
        <div className="flex items-end gap-2 mb-1"><span className="text-7xl font-black text-zinc-900 leading-none">112</span><span className="text-xl text-zinc-400 mb-3">mg/dl</span></div>
        <p className="text-sm text-zinc-500 mb-5">Khaali Pet (Fasting)</p>
        <div className="flex items-end gap-1.5 h-12 mb-5">{[60,80,55,90,75,100,70,85,65,112].map((h,i) => (<div key={i} className={`flex-1 rounded-sm ${i===9?"bg-emerald-500":"bg-zinc-100"}`} style={{height:`${(h/112)*100}%`}} />))}</div>
        <div className="bg-emerald-50 rounded-2xl p-3.5"><div className="flex items-start gap-2"><Bot className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" /><p className="text-xs text-emerald-800 leading-relaxed">Aap ki Sugar Normal hai. Achha khaana aur waqt par dawai lena jaari rakhein!</p></div></div>
      </div>
      <div className="absolute -top-3 -right-3 bg-amber-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">AI Powered</div>
      <div className="absolute -bottom-3 -left-3 bg-white border border-zinc-100 shadow-lg rounded-2xl px-3 py-2 flex items-center gap-2"><Bell className="w-4 h-4 text-primary" /><span className="text-xs font-medium text-zinc-700">Reminder set</span></div>
    </div>
  );
}

function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (<div className="flex gap-5"><div className="shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-base shadow-lg shadow-primary/30">{num}</div><div className="pt-1"><h3 className="font-semibold text-zinc-900 text-base mb-1">{title}</h3><p className="text-sm text-zinc-500 leading-relaxed">{desc}</p></div></div>);
}

function FeatureCard({ icon: Icon, color, bg, title, titleEn, desc }: { icon: React.ElementType; color: string; bg: string; title: string; titleEn: string; desc: string }) {
  return (<div className="group bg-white rounded-2xl p-6 border border-zinc-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"><div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}><Icon className={`w-6 h-6 ${color}`} /></div><h3 className="font-bold text-zinc-900 text-base mb-0.5">{title}</h3><p className="text-xs text-zinc-400 mb-2 font-medium">{titleEn}</p><p className="text-sm text-zinc-500 leading-relaxed">{desc}</p></div>);
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar activePage="home" />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/40 to-white pt-10 pb-16 sm:pt-20 sm:pb-24">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-zinc-900 leading-[1.1] tracking-tight mb-6">Apni Sugar Ko<span className="text-primary"> Samjhein</span>,<br />Sehat Ko Behtar Banayein</h1>
                <p className="text-lg text-zinc-500 leading-relaxed mb-8 max-w-lg">Sugar Buddy aapki glucose readings track karta hai, har reading ko <strong className="text-zinc-700">Roman Urdu</strong> mein samjhata hai, aur <strong className="text-zinc-700">AI Chat</strong> se diabetes ke sawalon ke jawab deta hai.</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10">{["Affordable Plans","Roman Urdu mein","AI-Powered","Safe & Private"].map((t) => (<div key={t} className="flex items-center gap-1.5 text-sm text-zinc-600"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{t}</div>))}</div>
                <div className="flex flex-col sm:flex-row gap-3"><Link href="/signup" className="inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-white bg-primary rounded-2xl hover:bg-primary-dark transition-colors shadow-xl shadow-primary/25"><Zap className="w-5 h-5" /> Abhi Shuru Karein</Link></div>
                <p className="text-xs text-zinc-400 mt-4">Works on all devices · Urdu & English</p>
              </div>
              <div className="lg:pl-8"><HeroReadingCard /></div>
            </div>
          </div>
        </section>

        <section className="bg-primary py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6"><div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">{[{val:"Low",label:"Affordable Cost",sub:"Sasti aur asaan"},{val:"AI",label:"Powered Chat",sub:"Roman Urdu mein"},{val:"4",label:"Reading Types",sub:"Fasting · Post-meal · Random · Bedtime"},{val:"24/7",label:"Access",sub:"Kabhi bhi, kahin bhi"}].map((s)=>(<div key={s.val}><div className="text-3xl font-black text-white mb-1">{s.val}</div><div className="text-sm font-semibold text-emerald-100">{s.label}</div><div className="text-xs text-emerald-200/70 mt-0.5">{s.sub}</div></div>))}</div></div></section>

        <section id="features" className="py-20 sm:py-28 bg-white"><div className="max-w-6xl mx-auto px-4 sm:px-6"><div className="text-center max-w-2xl mx-auto mb-14"><p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Features</p><h2 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-4">Sab kuch ek jagah</h2><p className="text-zinc-500 text-lg">Everything you need to manage your diabetes — simple and affordable.</p></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"><FeatureCard icon={Activity} color="text-emerald-600" bg="bg-emerald-50" title="Readings Log Karein" titleEn="Log Glucose Readings" desc="Ek tap mein apni Sugar reading darj karein — fasting, post-meal, random ya bedtime." /><FeatureCard icon={Bot} color="text-violet-600" bg="bg-violet-50" title="AI Tashreeh" titleEn="AI Explanations in Roman Urdu" desc="Har reading ke baad AI aapko simple Roman Urdu mein batata hai ke reading kaisi hai." /><FeatureCard icon={BarChart2} color="text-blue-600" bg="bg-blue-50" title="Rujhaanaat Dekhein" titleEn="Track Trends & Patterns" desc="90 din ke glucose trends graph par dekhein." /><FeatureCard icon={Bot} color="text-amber-600" bg="bg-amber-50" title="AI Chat" titleEn="Ask Anything About Diabetes" desc="Apna koi bhi sawal poochein — khoraak, warzish, HbA1c. AI jawab dega Roman Urdu mein." /><FeatureCard icon={Bell} color="text-rose-600" bg="bg-rose-50" title="Yaad-Dehaaniyaan" titleEn="Smart Reminders" desc="Test lene, dawai khaane ke liye reminders." /><FeatureCard icon={ShieldCheck} color="text-teal-600" bg="bg-teal-50" title="Safety Gate" titleEn="Automatic Safety Alerts" desc="Agar reading khatarnaak range mein jaaye to system khud fori alert deta hai." /></div></div></section>

        <section id="how" className="py-20 sm:py-28 bg-gradient-to-br from-zinc-50 to-emerald-50/30"><div className="max-w-6xl mx-auto px-4 sm:px-6"><div className="grid lg:grid-cols-2 gap-16 items-center"><div><p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">How it works</p><h2 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-10">Sirf 3 aasaan qadam</h2><div className="space-y-8"><Step num="1" title="Account Banayein" desc="Google ya email se sign up karein. Sirf 30 seconds." /><Step num="2" title="Apni Reading Log Karein" desc="Glucose meter se number daalen, reading ki qism chunein aur save karein." /><Step num="3" title="Roman Urdu mein Samjhein" desc="AI foran batata hai ke reading kaisi hai aur kya karna chahiye." /></div><div className="mt-10"><Link href="/signup" className="inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-white bg-primary rounded-2xl hover:bg-primary-dark transition-colors shadow-xl shadow-primary/25">Abhi Shuru Karein<ChevronRight className="w-5 h-5" /></Link></div></div><div className="relative"><div className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-8"><div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center"><Heart className="w-5 h-5 text-white" /></div><div><p className="font-bold text-zinc-900">Sugar Buddy</p><p className="text-xs text-zinc-400">Your Diabetes Companion</p></div></div><div className="space-y-4">{[{label:"Fasting reading logged",sub:"112 mg/dl — Normal",color:"text-emerald-600"},{label:"AI tashreeh mil gayi",sub:"Roman Urdu mein",color:"text-emerald-600"},{label:"Reminder set",sub:"Next check-in",color:"text-emerald-600"},{label:"Weekly trend: improving",sub:"Avg: 118",color:"text-blue-600"}].map((item)=>(<div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50"><CheckCircle2 className={`w-5 h-5 ${item.color} mt-0.5 shrink-0`} /><div><p className="text-sm font-medium text-zinc-900">{item.label}</p><p className="text-xs text-zinc-400">{item.sub}</p></div></div>))}</div></div></div></div></div></section>

        <section className="py-20 sm:py-28 bg-gradient-to-br from-emerald-600 to-emerald-800 relative overflow-hidden"><div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center"><h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">Apni Sehat ka Safar<br /><span className="text-emerald-200">Aaj Hi Shuru Karein</span></h2><p className="text-lg text-emerald-100 mb-10 max-w-xl mx-auto">Hazaron Pakistani patients apni Sugar track karte hain. Aap bhi shuru karein — sasta, aasaan, Roman Urdu mein.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><Link href="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-emerald-700 bg-white rounded-2xl hover:bg-emerald-50 transition-colors shadow-2xl"><Zap className="w-5 h-5" /> Account Banayein</Link></div></div></section>
      </main>

      <footer className="bg-zinc-50 border-t border-zinc-100"><div className="max-w-6xl mx-auto px-4 sm:px-6 py-12"><div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10"><div><div className="flex items-center gap-2 mb-3"><LogoMark size={26} /><span className="text-base font-bold text-primary">Sugar Buddy</span></div><p className="text-sm text-zinc-500 leading-relaxed max-w-xs">Smart glucose tracker for diabetes patients. Track readings, get AI explanations in Roman Urdu.</p></div><div><p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Navigation</p><ul className="space-y-2">{[{label:"Home",href:"/"},{label:"FAQ",href:"/faq"},{label:"Pricing",href:"/pricing"},{label:"Sign Up",href:"/signup"}].map((l)=>(<li key={l.href}><Link href={l.href} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">{l.label}</Link></li>))}</ul></div><div><p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Disclaimer</p><div className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /><p className="text-sm text-zinc-500 leading-relaxed"><strong className="text-zinc-700">Yeh tibbi mashwarah nahi hai.</strong> Sugar Buddy sirf educational purposes ke liye hai.</p></div></div></div><div className="border-t border-zinc-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"><p className="text-xs text-zinc-400">&copy; {new Date().getFullYear()} Sugar Buddy. All rights reserved.</p><p className="text-xs text-zinc-400">Not a medical device. Consult your doctor.</p></div></div></footer>
    </div>
  );
}

"use client";
import { useActionState } from "react";
import { logReading, type ReadingState } from "@/app/actions/readings";
import { useState } from "react";
import Link from "next/link";
import { Coffee, Utensils, Shuffle, Moon, AlertTriangle, Bot, Save, Loader2 } from "lucide-react";
import { BadgeToast } from "@/components/BadgeToast";

const READING_TYPES = [
  { value: "FASTING", labelUr: "Khaali Pet", labelEn: "Fasting", Icon: Coffee },
  { value: "POST_MEAL", labelUr: "Khaane ke Baad", labelEn: "Post-Meal", Icon: Utensils },
  { value: "RANDOM", labelUr: "Be-Tarteeb", labelEn: "Random", Icon: Shuffle },
  { value: "BEDTIME", labelUr: "Sone se Pehle", labelEn: "Bedtime", Icon: Moon },
];

const CLASSIFICATION_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  LOW: { bg: "bg-blue-50 border-blue-200", text: "text-blue-800", label: "Kam (Low)" },
  IN_RANGE: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800", label: "Normal (In Range)" },
  HIGH: { bg: "bg-amber-50 border-amber-200", text: "text-amber-800", label: "Ziyaada (High)" },
  DANGER: { bg: "bg-red-50 border-red-200", text: "text-red-800", label: "Khatarnaak (Dangerous)" },
};

export default function LogReadingPage() {
  const [state, formAction, isPending] = useActionState<ReadingState, FormData>(logReading, undefined);
  const [selectedType, setSelectedType] = useState("FASTING");
  const now = new Date();
  const localDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  return (
    <div className="max-w-lg px-4 sm:px-6 py-6 sm:py-8">
      {state?.streak?.newBadges && state.streak.newBadges.length > 0 && (
        <BadgeToast badges={state.streak.newBadges} />
      )}
      <h1 className="text-2xl font-bold text-zinc-900 mb-2">Reading Log Karein</h1>
      <p className="text-text-secondary text-sm mb-8">Log your glucose reading</p>

      {state?.success && state.reading && (
        <div className="mb-8">
          {state.escalation && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
              <div className="flex items-center gap-2 text-base font-bold text-danger mb-2"><AlertTriangle className="w-5 h-5 shrink-0" /> Fori Tawajjuh Darkaar!</div>
              <p className="text-sm text-red-700 whitespace-pre-line">{state.escalation.reason}</p>
            </div>
          )}
          <div className={`p-5 border rounded-xl ${CLASSIFICATION_STYLES[state.reading.classification]?.bg || "bg-zinc-50 border-zinc-200"}`}>
            <div className="flex items-end gap-3 mb-3"><span className="text-3xl font-bold text-zinc-900">{Math.round(state.reading.value)}</span><span className="text-base text-text-secondary mb-1">mg/dl</span></div>
            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${CLASSIFICATION_STYLES[state.reading.classification]?.text || "text-zinc-700"}`}>{CLASSIFICATION_STYLES[state.reading.classification]?.label || state.reading.classification}</div>
            {state.interpretation && (<div className="mt-4 p-3 bg-white/80 rounded-xl"><p className="text-xs font-medium text-zinc-700 mb-1 flex items-center gap-1.5"><Bot className="w-3.5 h-3.5" /> AI Tashreeh:</p><p className="text-sm text-zinc-600 whitespace-pre-line leading-relaxed">{state.interpretation}</p></div>)}
          </div>
          <div className="flex gap-3 mt-4">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Meri sugar reading: ${Math.round(state.reading.value)} mg/dl (${CLASSIFICATION_STYLES[state.reading.classification]?.label || state.reading.classification})\n\nSugar Buddy app se — sugarbuddy.app`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 px-4 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              WhatsApp Share
            </a>
            <Link href="/dashboard" className="flex-1 text-center py-2.5 px-4 text-sm font-medium bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">Dashboard</Link>
            <button onClick={() => window.location.reload()} className="flex-1 text-center py-2.5 px-4 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors">Nayi Reading (New)</button>
          </div>
        </div>
      )}

      {!state?.success && (
        <form action={formAction} className="space-y-5">
          {state?.message && (<div className="p-3 bg-red-50 border border-red-200 rounded-xl text-danger text-sm text-center">{state.message}</div>)}
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-zinc-700 mb-1.5">Sugar Reading (mg/dl)</label>
            <input id="value" name="value" type="number" inputMode="numeric" required min="1" max="999" step="1" placeholder="e.g. 120" className="w-full px-4 py-2.5 text-base border border-zinc-200 rounded-xl focus:border-primary outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Reading ki Qism (Reading Type)</label>
            <div className="grid grid-cols-2 gap-2">
              {READING_TYPES.map((rt) => { const Icon = rt.Icon; return (
                <label key={rt.value} className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${selectedType === rt.value ? "border-primary bg-primary-light" : "border-zinc-200 bg-white hover:border-zinc-300"}`}>
                  <input type="radio" name="type" value={rt.value} checked={selectedType === rt.value} onChange={() => setSelectedType(rt.value)} className="sr-only" />
                  <Icon className={`w-4 h-4 shrink-0 ${selectedType === rt.value ? "text-primary" : "text-zinc-400"}`} />
                  <div><p className="text-sm font-medium text-zinc-900 leading-tight">{rt.labelUr}</p><p className="text-xs text-zinc-400">{rt.labelEn}</p></div>
                </label>
              ); })}
            </div>
          </div>
          <div>
            <label htmlFor="takenAt" className="block text-sm font-medium text-zinc-700 mb-1.5">Date & Time</label>
            <input id="takenAt" name="takenAt" type="datetime-local" defaultValue={localDatetime} className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:border-primary outline-none transition-colors" />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-zinc-700 mb-1.5">Notes (optional)</label>
            <textarea id="notes" name="notes" rows={2} placeholder="e.g. walk ki, biryani khayi, dawai li" className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:border-primary outline-none transition-colors resize-none" />
          </div>
          <button type="submit" disabled={isPending} className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-colors">
            {isPending ? (<span className="inline-flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Saving...</span>) : (<span className="inline-flex items-center gap-2"><Save className="w-4 h-4" /> Reading Save Karein</span>)}
          </button>
        </form>
      )}
    </div>
  );
}

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrCreateDbUser } from "@/lib/getOrCreateUser";
import { getClassificationLabel } from "@/lib/services/glucoseService";
import type { Classification } from "@/generated/prisma/client";
import { FileText, Bot, BarChart2, Settings, Bell, Activity, ShieldCheck, ChevronRight } from "lucide-react";
import { StreakCard, GoalCard, InsightsCard, DailyTipCard } from "./DashboardClient";

const CLASSIFICATION_COLORS: Record<string, string> = {
  LOW: "bg-blue-100 text-blue-800",
  IN_RANGE: "bg-emerald-100 text-emerald-800",
  HIGH: "bg-amber-100 text-amber-800",
  DANGER: "bg-red-100 text-red-800",
};

const FEATURES = [
  { icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50", href: "/log", title: "Reading Log Karna", titleEn: "Log a Reading", how: "Apne glucose meter se jo number aaye wo yahan likhein. Fasting, post-meal, random ya bedtime — qism chunein aur Save dabayein." },
  { icon: Bot, color: "text-violet-600", bg: "bg-violet-50", href: "/log", title: "AI Tashreeh", titleEn: "AI Explanation", how: "Reading save karte hi AI foran Roman Urdu mein batata hai ke aapki Sugar kaisi hai — Kam, Normal ya Ziyaada." },
  { icon: BarChart2, color: "text-blue-600", bg: "bg-blue-50", href: "/trends", title: "Trends Dekhna", titleEn: "View Trends", how: "Pichle 90 din ki readings ka graph dekhein. Aap ki ausat, sab se zyaada aur sab se kam Sugar ek jagah nazar aayegi." },
  { icon: Bot, color: "text-amber-600", bg: "bg-amber-50", href: "/copilot", title: "AI se Baat Karna", titleEn: "AI Chat", how: "Koi bhi sawal poochhein — khoraak, warzish, HbA1c. AI Roman Urdu mein jawab deta hai." },
  { icon: Bell, color: "text-rose-600", bg: "bg-rose-50", href: "/settings", title: "Settings", titleEn: "Profile & Settings", how: "Apni profile info update karein — naam, umar, diabetes type, insulin status." },
  { icon: ShieldCheck, color: "text-teal-600", bg: "bg-teal-50", href: "/log", title: "Safety Alert", titleEn: "Automatic Safety Alert", how: "Agar aapki reading 70 se kam ya 300 se zyaada ho to app FORI alert deta hai." },
];

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");
  const user = await getOrCreateDbUser();
  const latestReading = await prisma.reading.findFirst({ where: { userId }, orderBy: { takenAt: "desc" } });
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todayReadingsCount = await prisma.reading.count({ where: { userId, takenAt: { gte: todayStart } } });
  const userName = user?.name || "User";

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-1">Assalam-o-Alaikum, {userName}!</h1>
        <p className="text-text-secondary text-base">Aaj aap ki sehat kaisi hai? (How are you feeling today?)</p>
      </div>

      {/* Streak + Daily Tip */}
      <StreakCard />
      <DailyTipCard />

      {/* AI Insights */}
      <InsightsCard />

      {/* Goal Progress */}
      <GoalCard />

      {latestReading ? (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900">Aakhri Reading (Latest)</h2>
            <span className="text-sm text-text-secondary">{new Date(latestReading.takenAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div className="flex items-end gap-4 mb-4">
            <span className="text-5xl sm:text-6xl font-bold text-zinc-900">{Math.round(latestReading.value)}</span>
            <span className="text-xl text-text-secondary mb-2">mg/dl</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${CLASSIFICATION_COLORS[latestReading.classification] || "bg-zinc-100 text-zinc-700"}`}>
              {getClassificationLabel(latestReading.classification as Classification).romanUrdu} ({getClassificationLabel(latestReading.classification as Classification).english})
            </span>
            <span className="text-sm text-text-secondary">Aaj ki Readings: {todayReadingsCount}</span>
          </div>
          {latestReading.interpretation && (
            <div className="mt-4 p-4 bg-primary-light rounded-xl">
              <p className="text-sm text-zinc-700 whitespace-pre-line leading-relaxed">{latestReading.interpretation}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8 mb-6 text-center">
          <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Abhi tak koi Reading nahi (No readings yet)</h2>
          <p className="text-text-secondary mb-6">Apni pehli Sugar reading log karein!</p>
          <Link href="/log" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors">
            <FileText className="w-4 h-4" /> Pehli Reading Log Karein
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <Link href="/log" className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors shadow-sm">
          <FileText className="w-5 h-5 shrink-0" />
          <div><div className="text-sm font-semibold">Reading Log Karein</div><div className="text-xs opacity-80">Log a Reading</div></div>
        </Link>
        <Link href="/copilot" className="flex items-center gap-3 px-4 py-3 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors shadow-sm">
          <Bot className="w-5 h-5 shrink-0 text-primary" />
          <div><div className="text-sm font-semibold text-zinc-900">AI se Baat Karein</div><div className="text-xs text-text-secondary">AI Chat</div></div>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/trends" className="flex flex-col items-center gap-2 p-4 bg-surface rounded-xl hover:bg-zinc-100 transition-colors text-center">
            <BarChart2 className="w-7 h-7 text-primary" /><span className="text-sm font-medium text-zinc-700">Trends</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center gap-2 p-4 bg-surface rounded-xl hover:bg-zinc-100 transition-colors text-center">
            <Settings className="w-7 h-7 text-zinc-500" /><span className="text-sm font-medium text-zinc-700">Settings</span>
          </Link>
        </div>
      </div>

      <div>
        <div className="mb-6"><h2 className="text-xl font-bold text-zinc-900 mb-1">App Kaise Use Karein?</h2><p className="text-sm text-text-secondary">How to use each feature</p></div>
        <div className="space-y-4">
          {FEATURES.map((f) => { const Icon = f.icon; return (
            <div key={f.title} className="bg-white rounded-2xl border border-zinc-100 p-5">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center shrink-0`}><Icon className={`w-5 h-5 ${f.color}`} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div><h3 className="font-semibold text-zinc-900 text-base">{f.title}</h3><p className="text-xs text-zinc-400">{f.titleEn}</p></div>
                    <Link href={f.href} className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors">Kholein<ChevronRight className="w-3.5 h-3.5" /></Link>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed">{f.how}</p>
                </div>
              </div>
            </div>
          ); })}
        </div>
      </div>
    </div>
  );
}

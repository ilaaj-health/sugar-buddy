"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Trophy, Target, Lightbulb, AlertTriangle, TrendingUp, ChevronRight } from "lucide-react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  badges: Array<{ key: string; name: string; description: string; earnedAt: string }>;
}

interface Insight {
  type: "warning" | "positive" | "info";
  message: string;
}

interface GoalData {
  goalTarget: number | null;
  goalType: string | null;
}

interface TipData {
  tip: string;
  tipEn: string;
}

export function StreakCard() {
  const [data, setData] = useState<StreakData | null>(null);

  useEffect(() => {
    fetch("/api/streak").then(r => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-semibold text-zinc-900">Daily Streak</span>
        </div>
        <span className="text-xs text-zinc-500">Best: {data.longestStreak} days</span>
      </div>
      <div className="flex items-end gap-2 mb-3">
        <span className="text-3xl font-black text-orange-600">{data.currentStreak}</span>
        <span className="text-sm text-zinc-500 mb-1">din lagatar</span>
      </div>
      {/* Badges */}
      {data.badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.badges.map(b => (
            <span key={b.key} className="inline-flex items-center gap-1 px-2 py-1 bg-white/80 border border-amber-200 rounded-full text-[10px] font-medium text-amber-700" title={b.description}>
              <Trophy className="w-3 h-3" />
              {b.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function GoalCard() {
  const [goal, setGoal] = useState<GoalData | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch("/api/goals").then(r => r.json()).then(d => {
      setGoal(d);
      if (d.goalTarget) {
        // Fetch recent average to calculate progress
        fetch("/api/streak").then(r => r.json()).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  async function saveGoal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const target = parseInt(fd.get("target") as string);
    const type = fd.get("type") as string;
    if (isNaN(target)) return;
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalTarget: target, goalType: type }),
    });
    setGoal({ goalTarget: target, goalType: type });
    setEditing(false);
  }

  if (!goal) return null;

  if (!goal.goalTarget || editing) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-zinc-900">Set Your Goal</span>
        </div>
        <form onSubmit={saveGoal} className="flex items-end gap-2">
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1 block">Target (mg/dl)</label>
            <input name="target" type="number" defaultValue={goal.goalTarget || 130} min={50} max={300} className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:border-primary outline-none" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1 block">Reading Type</label>
            <select name="type" defaultValue={goal.goalType || "FASTING"} className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg bg-white">
              <option value="FASTING">Fasting</option>
              <option value="POST_MEAL">Post-Meal</option>
            </select>
          </div>
          <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">Save</button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-zinc-900">Goal: {goal.goalType === "FASTING" ? "Fasting" : "Post-Meal"} under {goal.goalTarget}</span>
        </div>
        <button onClick={() => setEditing(true)} className="text-xs text-primary hover:underline">Edit</button>
      </div>
      <div className="w-full bg-zinc-100 rounded-full h-2">
        <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${Math.min(100, progress || 60)}%` }} />
      </div>
      <p className="text-xs text-zinc-400 mt-1">Target: {goal.goalTarget} mg/dl</p>
    </div>
  );
}

export function InsightsCard() {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    fetch("/api/insights").then(r => r.json()).then(d => setInsights(d.insights || [])).catch(() => {});
  }, []);

  if (insights.length === 0) return null;

  const iconMap = {
    warning: <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />,
    positive: <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />,
    info: <Lightbulb className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />,
  };

  const bgMap = {
    warning: "bg-amber-50 border-amber-100",
    positive: "bg-emerald-50 border-emerald-100",
    info: "bg-blue-50 border-blue-100",
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-semibold text-zinc-900">AI Insights</span>
      </div>
      <div className="space-y-2">
        {insights.map((ins, i) => (
          <div key={i} className={`flex items-start gap-2 p-3 rounded-xl border ${bgMap[ins.type]}`}>
            {iconMap[ins.type]}
            <p className="text-xs text-zinc-700 leading-relaxed">{ins.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DailyTipCard() {
  const [tip, setTip] = useState<TipData | null>(null);

  useEffect(() => {
    fetch("/api/tips").then(r => r.json()).then(setTip).catch(() => {});
  }, []);

  if (!tip) return null;

  return (
    <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 mb-4">
      <div className="flex items-start gap-2">
        <Lightbulb className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-violet-700 mb-0.5">Aaj ki Tip</p>
          <p className="text-xs text-violet-800 leading-relaxed">{tip.tip}</p>
          <p className="text-[10px] text-violet-500 mt-1">{tip.tipEn}</p>
        </div>
      </div>
    </div>
  );
}

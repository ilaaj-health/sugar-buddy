"use client";

import { useState, useEffect } from "react";
import { Trophy, X } from "lucide-react";

interface BadgeToastProps {
  badges: string[];
}

export function BadgeToast({ badges }: BadgeToastProps) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (badges.length > 0) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [badges]);

  if (!visible || badges.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] animate-[fadeInUp_0.4s_ease-out]">
      <div className="bg-white border border-amber-200 shadow-xl rounded-2xl p-4 flex items-start gap-3 max-w-xs">
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
          <Trophy className="w-5 h-5 text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-zinc-900">Naya Badge Mila!</p>
          <p className="text-xs text-zinc-600 mt-0.5">{badges[current]}</p>
        </div>
        <button onClick={() => setVisible(false)} className="text-zinc-400 hover:text-zinc-600 shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

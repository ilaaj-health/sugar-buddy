"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Pill, ChevronRight } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  dosage: string | null;
  times: string[];
  enabled: boolean;
}

export function MedicineCard() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    fetch("/api/medicines").then(r => r.json()).then(d => {
      const meds = Array.isArray(d) ? d.filter((m: Record<string, unknown>) => m.enabled).map((m: Record<string, unknown>) => ({ ...m, times: typeof m.times === 'string' ? JSON.parse(m.times as string) : m.times })) as Medicine[] : [];
      setMedicines(meds);
    }).catch(() => {});
  }, []);

  if (medicines.length === 0) return null;

  return (
    <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Pill className="w-4 h-4 text-violet-600" />
          <span className="text-xs font-semibold text-violet-800">Aaj ki Dawai</span>
        </div>
        <Link href="/medicines" className="text-[10px] text-violet-600 hover:underline flex items-center gap-0.5">
          Manage <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-1.5">
        {medicines.slice(0, 3).map(m => (
          <div key={m.id} className="flex items-center justify-between bg-white/60 rounded-lg px-2.5 py-1.5">
            <span className="text-xs font-medium text-zinc-800">{m.name} {m.dosage ? `(${m.dosage})` : ''}</span>
            <span className="text-[10px] text-violet-600">{(Array.isArray(m.times) ? m.times : []).join(", ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

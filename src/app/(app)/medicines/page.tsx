"use client";

import { useState, useEffect } from "react";
import { Pill, Plus, Trash2, Clock, X, Loader2 } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  dosage: string | null;
  times: string[];
  enabled: boolean;
}

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/medicines").then(r => r.json()).then(d => {
      setMedicines(Array.isArray(d) ? d.map((m: Record<string, unknown>) => ({ ...m, times: typeof m.times === 'string' ? JSON.parse(m.times as string) : m.times })) as Medicine[] : []);
      setLoading(false);
    });
  }, []);

  async function addMedicine(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const dosage = fd.get("dosage") as string;
    const timesRaw = fd.get("times") as string;
    const times = timesRaw.split(",").map(t => t.trim()).filter(Boolean);

    await fetch("/api/medicines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, dosage, times }),
    });

    const res = await fetch("/api/medicines");
    const data = await res.json();
    setMedicines(Array.isArray(data) ? data.map((m: Record<string, unknown>) => ({ ...m, times: typeof m.times === 'string' ? JSON.parse(m.times as string) : m.times })) as Medicine[] : []);
    setShowForm(false);
    setSaving(false);
  }

  async function deleteMedicine(id: string) {
    if (!confirm("Kya aap yeh dawai delete karna chahte hain?")) return;
    await fetch(`/api/medicines/${id}`, { method: "DELETE" });
    setMedicines(prev => prev.filter(m => m.id !== id));
  }

  async function toggleMedicine(id: string, enabled: boolean) {
    await fetch(`/api/medicines/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: !enabled }) });
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  }

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dawai Reminders</h1>
          <p className="text-sm text-zinc-500">Medicine Reminders</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors">
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? "Cancel" : "Add"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={addMedicine} className="bg-white border border-zinc-200 rounded-xl p-4 mb-6 space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Dawai ka Naam (Medicine Name)</label>
            <input name="name" required placeholder="e.g. Metformin" className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Dosage (optional)</label>
            <input name="dosage" placeholder="e.g. 500mg" className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Times (comma separated)</label>
            <input name="times" required placeholder="08:00, 20:00" className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:border-primary outline-none" />
            <p className="text-[10px] text-zinc-400 mt-0.5">e.g. 08:00, 14:00, 20:00</p>
          </div>
          <button type="submit" disabled={saving} className="w-full py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-colors">
            {saving ? <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span> : "Save Medicine"}
          </button>
        </form>
      )}

      {/* Medicine list */}
      {loading ? (
        <p className="text-sm text-zinc-400">Loading...</p>
      ) : medicines.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center">
          <Pill className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-zinc-900 mb-1">Koi dawai nahi</p>
          <p className="text-xs text-zinc-400">Add dabayein aur apni dawai ka schedule set karein.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {medicines.map(m => (
            <div key={m.id} className={`bg-white border rounded-xl p-4 transition-colors ${m.enabled ? "border-zinc-200" : "border-zinc-100 opacity-60"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
                    <Pill className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{m.name}</p>
                    {m.dosage && <p className="text-xs text-zinc-400">{m.dosage}</p>}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      <p className="text-xs text-zinc-500">{(Array.isArray(m.times) ? m.times : []).join(", ")}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleMedicine(m.id, m.enabled)} className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${m.enabled ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-400"}`}>
                    {m.enabled ? "ON" : "OFF"}
                  </button>
                  <button onClick={() => deleteMedicine(m.id)} className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

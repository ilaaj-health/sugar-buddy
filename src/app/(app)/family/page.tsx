"use client";

import { useState, useEffect } from "react";
import { Copy, UserPlus, Trash2, Eye, Loader2, CheckCircle } from "lucide-react";

interface FamilyData {
  inviteCode: string | null;
  caring: Array<{ id: string; patientId: string; name: string; email: string }>;
  caregivers: Array<{ id: string; caregiverId: string; name: string; email: string }>;
}

interface PatientView {
  patient: { name: string; age: number; diabetesType: string; currentStreak: number };
  readings: Array<{ value: number; type: string; classification: string; takenAt: string; notes: string }>;
}

const TYPE_LABELS: Record<string, string> = { FASTING: "Fasting", POST_MEAL: "Post-Meal", RANDOM: "Random", BEDTIME: "Bedtime" };
const CLASS_COLORS: Record<string, string> = { IN_RANGE: "text-emerald-600", HIGH: "text-amber-600", LOW: "text-blue-600", DANGER: "text-red-600" };
const CLASS_LABELS: Record<string, string> = { IN_RANGE: "Normal", HIGH: "High", LOW: "Low", DANGER: "Danger" };

export default function FamilyPage() {
  const [data, setData] = useState<FamilyData | null>(null);
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewing, setViewing] = useState<PatientView | null>(null);
  const [viewingName, setViewingName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const res = await fetch("/api/family");
    setData(await res.json());
  }

  async function generateCode() {
    setGenerating(true);
    const res = await fetch("/api/family", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "generate" }) });
    const d = await res.json();
    setData(prev => prev ? { ...prev, inviteCode: d.inviteCode } : prev);
    setGenerating(false);
  }

  async function joinFamily() {
    if (!code.trim()) return;
    setJoining(true);
    setError("");
    const res = await fetch("/api/family", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "join", code: code.trim() }) });
    const d = await res.json();
    if (d.success) { setCode(""); loadData(); } else { setError(d.error || "Failed"); }
    setJoining(false);
  }

  async function unlink(linkId: string) {
    if (!confirm("Remove this family link?")) return;
    await fetch("/api/family/unlink", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ linkId }) });
    loadData();
  }

  async function viewPatient(patientId: string, name: string) {
    setViewingName(name);
    const res = await fetch(`/api/family/patient?id=${patientId}`);
    setViewing(await res.json());
  }

  function copyCode() {
    if (data?.inviteCode) { navigator.clipboard.writeText(data.inviteCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }

  if (!data) return <div className="px-4 sm:px-6 py-6 text-sm text-zinc-400">Loading...</div>;

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-lg">
      <h1 className="text-2xl font-bold text-zinc-900 mb-1">Family Access</h1>
      <p className="text-sm text-zinc-500 mb-8">Share readings with family or caregivers</p>

      {/* My invite code */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold text-zinc-700 mb-2">Apna Invite Code</p>
        <p className="text-xs text-zinc-400 mb-3">Yeh code apne caregiver ko dein — woh aapki readings dekh sakenge.</p>
        {data.inviteCode ? (
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-mono font-bold text-primary tracking-wider">{data.inviteCode}</code>
            <button onClick={copyCode} className="px-3 py-2 text-xs font-medium text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors">
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <button onClick={generateCode} disabled={generating} className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors">
            {generating ? "Generating..." : "Code Generate Karein"}
          </button>
        )}
      </div>

      {/* Join as caregiver */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold text-zinc-700 mb-2">Kisi ki Readings Dekhein</p>
        <p className="text-xs text-zinc-400 mb-3">Patient ka invite code daalein — unki readings aap dekh sakenge.</p>
        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
        <div className="flex gap-2">
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="SB-XXXXXX" className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:border-primary outline-none font-mono uppercase" />
          <button onClick={joinFamily} disabled={joining} className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors">
            {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* People I care for */}
      {data.caring.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-zinc-700 mb-3">Jinki readings aap dekhte hain</p>
          <div className="space-y-2">
            {data.caring.map(c => (
              <div key={c.id} className="flex items-center justify-between bg-white border border-zinc-200 rounded-xl px-4 py-3">
                <div><p className="text-sm font-medium text-zinc-900">{c.name || c.email}</p><p className="text-xs text-zinc-400">{c.email}</p></div>
                <div className="flex gap-1">
                  <button onClick={() => viewPatient(c.patientId, c.name || c.email)} className="p-1.5 text-zinc-400 hover:text-primary rounded-lg hover:bg-primary-light transition-colors"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => unlink(c.id)} className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My caregivers */}
      {data.caregivers.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-zinc-700 mb-3">Jo aapki readings dekhte hain</p>
          <div className="space-y-2">
            {data.caregivers.map(c => (
              <div key={c.id} className="flex items-center justify-between bg-white border border-zinc-200 rounded-xl px-4 py-3">
                <div><p className="text-sm font-medium text-zinc-900">{c.name || c.email}</p><p className="text-xs text-zinc-400">{c.email}</p></div>
                <button onClick={() => unlink(c.id)} className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patient view modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-zinc-900">{viewingName}&apos;s Readings</h3>
              <button onClick={() => setViewing(null)} className="text-zinc-400 hover:text-zinc-600 text-sm">Close</button>
            </div>
            {viewing.patient && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-zinc-50 rounded-lg p-2 text-center"><p className="text-xs text-zinc-400">Age</p><p className="text-sm font-bold">{viewing.patient.age || '—'}</p></div>
                <div className="bg-zinc-50 rounded-lg p-2 text-center"><p className="text-xs text-zinc-400">Type</p><p className="text-sm font-bold">{viewing.patient.diabetesType || '—'}</p></div>
                <div className="bg-zinc-50 rounded-lg p-2 text-center"><p className="text-xs text-zinc-400">Streak</p><p className="text-sm font-bold">{viewing.patient.currentStreak || 0} days</p></div>
              </div>
            )}
            <div className="space-y-2">
              {viewing.readings.map((r, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 bg-zinc-50 rounded-lg">
                  <div>
                    <span className="text-sm font-semibold text-zinc-900">{Math.round(r.value)} mg/dl</span>
                    <span className="text-xs text-zinc-400 ml-2">{TYPE_LABELS[r.type] || r.type}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium ${CLASS_COLORS[r.classification] || ''}`}>{CLASS_LABELS[r.classification] || r.classification}</span>
                    <p className="text-[10px] text-zinc-400">{new Date(r.takenAt).toLocaleString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
              {viewing.readings.length === 0 && <p className="text-xs text-zinc-400 text-center py-4">No readings yet</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useActionState } from "react";
import { updateProfile, type SettingsState } from "@/app/actions/settings";
import { useState } from "react";
import { User, Calendar, Activity, Syringe, Mail, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

const DIABETES_TYPES = [{ value: "TYPE_1", label: "Type 1" }, { value: "TYPE_2", label: "Type 2" }, { value: "PRE_DIABETIC", label: "Pre-Diabetic" }, { value: "NOT_SURE", label: "Not Sure" }];

export function ProfileForm({ defaultValues }: { defaultValues: { name: string; email: string; age: number; diabetesType: string; onInsulin: boolean; createdAt: string } }) {
  const [state, formAction, isPending] = useActionState<SettingsState, FormData>(updateProfile, undefined);
  const [onInsulin, setOnInsulin] = useState(defaultValues.onInsulin);
  const memberSince = new Date(defaultValues.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {state?.message && (<div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${state.success ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>{state.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}{state.message}</div>)}
      <div className="bg-white rounded-xl border border-zinc-100 p-4"><div className="flex items-center gap-3 mb-1"><Mail className="w-4 h-4 text-zinc-400" /><span className="text-sm font-medium text-zinc-500">Email</span></div><p className="text-sm text-zinc-900 ml-7">{defaultValues.email}</p><p className="text-xs text-zinc-400 ml-7 mt-1">Member since {memberSince}</p></div>
      <form action={formAction} className="space-y-4">
        <div className="bg-white rounded-xl border border-zinc-100 p-4"><label htmlFor="name" className="flex items-center gap-3 mb-2"><User className="w-4 h-4 text-zinc-400" /><span className="text-sm font-medium text-zinc-700">Naam (Name)</span></label><input id="name" name="name" type="text" required defaultValue={defaultValues.name} className="w-full ml-7 px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:border-primary outline-none transition-colors" /></div>
        <div className="bg-white rounded-xl border border-zinc-100 p-4"><label htmlFor="age" className="flex items-center gap-3 mb-2"><Calendar className="w-4 h-4 text-zinc-400" /><span className="text-sm font-medium text-zinc-700">Umar (Age)</span></label><input id="age" name="age" type="number" inputMode="numeric" required min="1" max="150" defaultValue={defaultValues.age || ""} className="w-full ml-7 px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:border-primary outline-none transition-colors" /></div>
        <div className="bg-white rounded-xl border border-zinc-100 p-4"><div className="flex items-center gap-3 mb-3"><Activity className="w-4 h-4 text-zinc-400" /><span className="text-sm font-medium text-zinc-700">Diabetes Type</span></div><div className="grid grid-cols-2 gap-2 ml-7">{DIABETES_TYPES.map((dt) => (<label key={dt.value} className="relative"><input type="radio" name="diabetesType" value={dt.value} defaultChecked={defaultValues.diabetesType === dt.value} className="peer sr-only" /><div className="px-3 py-2 text-sm text-center border border-zinc-200 rounded-lg cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary-light peer-checked:text-primary font-medium hover:border-zinc-300">{dt.label}</div></label>))}</div></div>
        <div className="bg-white rounded-xl border border-zinc-100 p-4"><div className="flex items-center gap-3 mb-3"><Syringe className="w-4 h-4 text-zinc-400" /><span className="text-sm font-medium text-zinc-700">Insulin?</span></div><input type="hidden" name="onInsulin" value={String(onInsulin)} /><div className="flex gap-2 ml-7"><button type="button" onClick={() => setOnInsulin(true)} className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${onInsulin ? "border-primary bg-primary-light text-primary" : "border-zinc-200 text-zinc-500"}`}>Haan (Yes)</button><button type="button" onClick={() => setOnInsulin(false)} className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${!onInsulin ? "border-primary bg-primary-light text-primary" : "border-zinc-200 text-zinc-500"}`}>Nahi (No)</button></div></div>
        <button type="submit" disabled={isPending} className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-colors">{isPending ? <span className="inline-flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Saving...</span> : "Profile Update Karein (Save)"}</button>
      </form>
    </div>
  );
}

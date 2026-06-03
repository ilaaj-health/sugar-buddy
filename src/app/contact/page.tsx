"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Mail, MapPin, Clock, Send, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    setSent(true);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <HeroSection tag="Contact" title="Humse Raabta Karein" subtitle="Get in touch — we'd love to hear from you." />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">Email</p>
                <p className="text-sm text-zinc-500">support@sugarbuddy.app</p>
                <p className="text-xs text-zinc-400 mt-0.5">24 ghante mein jawab milega</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-blue-600" /></div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">Location</p>
                <p className="text-sm text-zinc-500">Lahore, Pakistan</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0"><Clock className="w-5 h-5 text-amber-600" /></div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">Response Time</p>
                <p className="text-sm text-zinc-500">Usually within 24 hours</p>
                <p className="text-xs text-zinc-400 mt-0.5">Mon–Sat, 9 AM – 6 PM PKT</p>
              </div>
            </div>
            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-500"><strong className="text-zinc-700">Medical emergencies:</strong> Fori taur par apne doctor ya hospital se raabta karein.</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold text-zinc-900 mb-1">Message Bhej Diya!</h3>
                <p className="text-sm text-zinc-500">Hum jald az jald jawab dein ge. Shukriya!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">Naam (Name)</label>
                  <input type="text" required placeholder="Aap ka naam" className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">Email</label>
                  <input type="email" required placeholder="aap@email.com" className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">Subject</label>
                  <select className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg bg-white focus:border-primary outline-none">
                    <option>General Inquiry</option>
                    <option>Technical Issue</option>
                    <option>Billing / Subscription</option>
                    <option>Feature Request</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">Message</label>
                  <textarea required rows={4} placeholder="Apna message likhein..." className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:border-primary outline-none resize-none" />
                </div>
                <button type="submit" disabled={sending} className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-colors">
                  {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Message Bhejein</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

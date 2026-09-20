"use client";

import React, { useState } from "react";
import { CheckCircle, Mail, Send, Sparkles } from "lucide-react";
import { apiUrl } from "@/lib/api";

export const GuestMessageSection: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch(apiUrl("/api/guest-messages"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Message submission failed");
      setForm({ name: "", email: "", message: "" });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
      <div className="relative overflow-hidden grid gap-10 lg:grid-cols-[0.8fr_1.2fr] items-start rounded-4xl border border-white/10 bg-white/5 p-6 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
        <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-orange-500/10 blur-[90px] pointer-events-none" />
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-400/30 flex items-center justify-center text-orange-400 mb-5 shadow-[0_0_28px_rgba(249,115,22,0.12)]">
            <Mail className="w-6 h-6" />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-orange-300 font-bold mb-3">Visitor support</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Need help?</h2>
          <h3 className="mt-2 text-lg font-semibold text-white/90">Message the PGHS Alumni team</h3>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Have a question about the school, alumni membership, events, or the website? Send us a message and our admin team will respond as soon as possible.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-2 text-xs font-medium text-orange-100">
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            We usually respond as soon as possible.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-xs font-semibold text-slate-300">
              Your name
              <input required minLength={2} maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Md Zobaer Islam" className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-orange-400/70 focus:bg-black/30" />
            </label>
            <label className="space-y-2 text-xs font-semibold text-slate-300">
              Email address
              <input required type="email" maxLength={160} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-orange-400/70 focus:bg-black/30" />
            </label>
          </div>
          <label className="block space-y-2 text-xs font-semibold text-slate-300">
            Your message
            <textarea required minLength={5} maxLength={5000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help..." rows={5} className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-orange-400/70 focus:bg-black/30" />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p role="status" className={`text-xs ${status === "error" ? "text-red-300" : status === "sent" ? "text-orange-200" : "text-slate-400"}`}>
              {status === "sent" ? "Message sent. Our admin will get back to you soon." : status === "error" ? "Could not send your message. Please try again." : "We usually respond as soon as possible."}
            </p>
            <button type="submit" disabled={status === "sending"} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-xs font-bold text-white shadow-[0_10px_24px_rgba(249,115,22,0.2)] transition hover:-translate-y-0.5 hover:bg-orange-400 disabled:cursor-wait disabled:opacity-60">
              <Send className="w-4 h-4" /> {status === "sending" ? "Sending..." : "Send message"}
            </button>
          </div>
          {status === "sent" && <CheckCircle className="w-5 h-5 text-orange-400" aria-label="Message sent" />}
        </form>
      </div>
    </section>
  );
};
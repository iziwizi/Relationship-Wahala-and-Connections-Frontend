"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Lock, Mail, AlertCircle, Info, ArrowRight, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Access denied. Invalid Super Admin credentials.");
        setSubmitting(false);
        return;
      }

      // HttpOnly JWT cookie set — navigate cleanly to admin portal
      window.location.assign("/admin");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const autoFill = () => {
    setEmail("admin@relationshipwahala.com");
    setPassword("Admin@123");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 mb-6">
          <div className="relative w-12 h-12">
            <Image src="/images/logo.jpeg" alt="Logo" fill className="object-contain rounded-md" priority />
          </div>
          <div className="text-left">
            <p className="font-serif font-bold text-white text-base leading-tight">RELATIONSHIP WAHALA</p>
            <p className="font-sans text-[10px] text-[#c9962c] tracking-widest uppercase font-semibold">Super Admin Portal</p>
          </div>
        </Link>
        <h1 className="font-serif text-2xl font-bold text-white">Super Admin Access</h1>
        <p className="mt-1 font-sans text-xs text-white/60">Restricted operational administration area</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1a1a1a] py-8 px-6 border border-white/10 rounded-2xl sm:px-10 shadow-2xl">
          {/* Demo Admin Info */}
          <div className="mb-6 p-4 bg-[#c9962c]/10 border border-[#c9962c]/30 rounded-xl">
            <div className="flex items-start gap-3">
              <Info size={18} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-xs font-bold text-[#c9962c] uppercase">Super Admin Test Credentials</p>
                <p className="font-sans text-xs text-white/80 mt-1">Email: admin@relationshipwahala.com</p>
                <p className="font-sans text-xs text-white/80">Password: Admin@123</p>
                <button
                  type="button"
                  onClick={autoFill}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#c9962c] underline"
                >
                  Auto-fill admin credentials <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-200 text-xs font-sans">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block font-sans text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">Admin Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@relationshipwahala.com"
                  className="block w-full pl-10 pr-3 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/40 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#c9962c]"
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">Admin Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-white/40 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#c9962c]"
                />
              </div>
            </div>

            <Button type="submit" variant="gold" size="lg" disabled={submitting} className="w-full justify-center">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                "Sign In to Admin Portal"
              )}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center flex items-center justify-center gap-2 text-white/40 font-sans text-xs">
          <ShieldAlert size={16} className="text-[#c9962c]" />
          <span>Server-Side Role Protected System</span>
        </div>
      </div>
    </div>
  );
}

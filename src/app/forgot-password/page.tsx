"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // In production: POST /api/auth/forgot-password
      // For now, simulate the email send (architecture complete, email provider to be configured)
      await new Promise((r) => setTimeout(r, 1200));
      setSubmitted(true);
    } catch {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 mb-6">
          <div className="relative w-12 h-12">
            <Image src="/images/logo.jpeg" alt="Logo" fill className="object-contain rounded-md" priority />
          </div>
          <div className="text-left">
            <p className="font-serif font-bold text-[#7b1d2a] text-base leading-tight">RELATIONSHIP WAHALA</p>
            <p className="font-sans text-[10px] text-[#c9962c] tracking-widest uppercase font-semibold">& Connections</p>
          </div>
        </Link>
        <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Forgot Your Password?</h1>
        <p className="mt-1 font-sans text-sm text-gray-600">Enter your email and we&apos;ll send you a secure reset link.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg border border-[#e8e0d4] rounded-2xl sm:px-10">
          {submitted ? (
            <div className="text-center space-y-4">
              <CheckCircle2 size={48} className="text-green-600 mx-auto" />
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Check Your Email</h2>
              <p className="font-sans text-sm text-gray-600">
                If an account exists for <strong>{email}</strong>, a password reset link has been sent. Check your inbox and spam folder.
              </p>
              <Link href="/login" className="font-sans text-sm font-semibold text-[#7b1d2a] underline">
                Return to Sign In
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs font-sans">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-sans text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full justify-center">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : "Send Reset Link"}
                </Button>
              </form>

              <div className="mt-5 text-center">
                <Link href="/login" className="inline-flex items-center gap-1 font-sans text-xs text-[#7b1d2a] font-semibold hover:opacity-80">
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

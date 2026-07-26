"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid or expired reset link. Please request a new one.");
      return;
    }

    setLoading(true);
    try {
      // In production: POST /api/auth/reset-password with { token, password }
      await new Promise((r) => setTimeout(r, 1200));
      setSuccess(true);
    } catch {
      setError("Password reset failed. The link may have expired. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <AlertCircle size={48} className="text-red-500 mx-auto" />
        <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Invalid Reset Link</h2>
        <p className="font-sans text-sm text-gray-600">This link is invalid or has expired.</p>
        <Link href="/forgot-password" className="font-sans text-sm font-semibold text-[#7b1d2a] underline">
          Request a New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 size={48} className="text-green-600 mx-auto" />
        <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Password Reset!</h2>
        <p className="font-sans text-sm text-gray-600">Your password has been updated. You can now sign in.</p>
        <Button href="/login" variant="primary" size="lg" className="w-full justify-center">Sign In Now</Button>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs font-sans">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-sans text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div>
            <input
              type={showPw ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-sans text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
            />
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full justify-center">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Resetting...</> : "Set New Password"}
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
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
        <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Set New Password</h1>
        <p className="mt-1 font-sans text-sm text-gray-600">Choose a strong password for your account.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg border border-[#e8e0d4] rounded-2xl sm:px-10">
          <Suspense fallback={<div className="text-center font-sans text-sm text-gray-500">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

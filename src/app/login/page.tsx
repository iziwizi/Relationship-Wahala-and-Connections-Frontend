"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Lock, Mail, AlertCircle, Info, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid email or password. Please try again.");
        setSubmitting(false);
        return;
      }

      // JWT cookie is now set — navigate to dashboard
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error && err.name === "TimeoutError") {
        setError("Request timed out. Please check your connection and try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("demo@relationshipwahala.com");
    setPassword("Demo@123");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Brand Logo & Heading */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 mb-6">
          <div className="relative w-14 h-14">
            <Image
              src="/images/logo.jpeg"
              alt="Relationship Wahala & Connections logo"
              fill
              className="object-contain rounded-md"
              priority
            />
          </div>
          <div className="text-left">
            <p className="font-serif font-bold text-[#7b1d2a] text-base leading-tight">
              RELATIONSHIP
            </p>
            <p className="font-serif font-bold text-[#7b1d2a] text-base leading-tight">
              WAHALA &amp; CONNECTIONS
            </p>
            <p className="font-sans text-[10px] text-[#c9962c] tracking-widest uppercase leading-tight font-semibold">
              Where Love Meets Wisdom
            </p>
          </div>
        </Link>

        <h1 className="font-serif text-3xl font-bold text-[#1a1a1a]">
          Member Sign In
        </h1>
        <p className="mt-2 font-sans text-sm text-gray-600">
          Welcome back to your intentional relationship journey
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#e8e0d4] rounded-2xl sm:px-10">
          {/* Demo Credentials Alert Banner */}
          <div className="mb-6 p-4 bg-[#7b1d2a]/5 border border-[#7b1d2a]/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-[#7b1d2a] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-xs font-bold text-[#7b1d2a] uppercase tracking-wider">
                  Client Demo Test Credentials
                </p>
                <div className="mt-1 font-sans text-xs text-gray-700 space-y-0.5">
                  <p><span className="font-semibold">Email:</span> demo@relationshipwahala.com</p>
                  <p><span className="font-semibold">Password:</span> Demo@123</p>
                </div>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="mt-2.5 inline-flex items-center gap-1 font-sans text-xs font-semibold text-[#7b1d2a] underline hover:text-[#5c1520]"
                >
                  Auto-fill demo credentials <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="font-sans">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block font-sans text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#7b1d2a] focus:border-transparent"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block font-sans text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#7b1d2a] focus:border-transparent"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#7b1d2a] focus:ring-[#7b1d2a] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block font-sans text-gray-700 text-sm">
                  Remember me
                </label>
              </div>

              <Link
                href="/forgot-password"
                className="font-sans text-xs font-semibold text-[#7b1d2a] hover:text-[#5c1520]"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
                className="w-full justify-center"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>
            </div>
          </form>

          {/* Footer links */}
          <div className="mt-6 text-center border-t border-gray-100 pt-6 space-y-2">
            <p className="font-sans text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-[#7b1d2a] hover:text-[#5c1520]">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center flex items-center justify-center gap-2 text-gray-500 font-sans text-xs">
          <ShieldCheck size={16} className="text-[#c9962c]" />
          <span>100% Confidential &amp; Vetted Matchmaking Platform</span>
        </div>
      </div>
    </div>
  );
}

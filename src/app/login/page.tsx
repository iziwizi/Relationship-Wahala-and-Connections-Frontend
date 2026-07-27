"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { Lock, Mail, AlertCircle, Info, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        window.location.assign("/dashboard");
      } else {
        setError(result.error || "Login failed. Please check your credentials.");
        setSubmitting(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
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
              alt="Relationship Wahala &amp; Connections logo"
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
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
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

          {/* Google Sign-in Alternative */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-sans font-semibold">
              <span className="bg-white px-3 text-gray-400">OR</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setError("Google Sign-In is currently in configuration mode. Please sign in with email & password.")}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-sans text-xs font-semibold shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { Lock, Mail, AlertCircle, ShieldCheck } from "lucide-react";

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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#7b1d2a] focus:ring-[#7b1d2a] border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block font-sans text-xs text-gray-600 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-xs">
                <Link
                  href="/forgot-password"
                  className="font-sans font-semibold text-[#7b1d2a] hover:text-[#5c1520] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
                className="w-full justify-center !py-3 font-sans text-sm font-semibold tracking-wide"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In to Your Account"
                )}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-400 font-sans">
                  New to Relationship Wahala?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/matchmaking/experience"
                className="w-full flex justify-center items-center px-4 py-3 border-2 border-[#7b1d2a] rounded-lg font-sans text-xs font-bold text-[#7b1d2a] hover:bg-[#7b1d2a] hover:text-white transition-colors duration-200"
              >
                Create a Free Account
              </Link>
            </div>
          </div>
        </div>

        {/* Security / Trust Footer */}
        <div className="mt-8 text-center flex items-center justify-center gap-2 text-gray-500 font-sans text-xs">
          <ShieldCheck size={16} className="text-[#c9962c]" />
          <span>256-Bit SSL Encrypted &amp; Confidential</span>
        </div>
      </div>
    </div>
  );
}

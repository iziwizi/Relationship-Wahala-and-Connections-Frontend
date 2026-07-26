"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { demoUser, UserProfile } from "@/data/demo/user";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_EMAIL = "demo@relationshipwahala.com";
const DEMO_PASS = "Demo@123";

function getInitialAuth(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("rwc_demo_auth") === "true";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getInitialAuth);
  const [user, setUser] = useState<UserProfile | null>(() =>
    getInitialAuth() ? demoUser : null
  );
  const [isLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  // Protect /dashboard routes
  useEffect(() => {
    if (pathname?.startsWith("/dashboard") && !isAuthenticated) {
      router.push("/login?redirect=" + encodeURIComponent(pathname));
    }
  }, [pathname, isAuthenticated, router]);

  const login = (email: string, pass: string) => {
    if (email.trim().toLowerCase() === DEMO_EMAIL.toLowerCase() && pass === DEMO_PASS) {
      localStorage.setItem("rwc_demo_auth", "true");
      setIsAuthenticated(true);
      setUser(demoUser);
      return { success: true };
    }
    return {
      success: false,
      error: "Invalid email address or password. Please use test credentials: demo@relationshipwahala.com / Demo@123",
    };
  };

  const logout = () => {
    localStorage.removeItem("rwc_demo_auth");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

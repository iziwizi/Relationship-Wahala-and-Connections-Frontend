// src/lib/repositories/packages.repository.ts
// Package data access — transparent demo/database switching

import { demoPackages, MatchmakingPackage } from "@/data/demo/packages";
import { isDatabaseMode } from "@/lib/db/mode";

// Normalised type that both demo and DB return
export type PackageRecord = MatchmakingPackage;

export async function getActivePackages(): Promise<PackageRecord[]> {
  if (!isDatabaseMode()) {
    return demoPackages.filter((p) => p.isActive);
  }

  // Database mode — lazy import Prisma so build works without DB_URL
  const { prisma } = await import("@/lib/db/prisma");
  const dbPkgs = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return dbPkgs.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    currency: p.currency,
    durationDays: p.durationDays,
    matchAllowance: p.matchAllowance,
    features: p.features,
    isPopular: p.isPopular,
    isActive: p.isActive,
  }));
}

export async function getPackageBySlug(slug: string): Promise<PackageRecord | null> {
  if (!isDatabaseMode()) {
    return demoPackages.find((p) => p.slug === slug) ?? null;
  }
  const { prisma } = await import("@/lib/db/prisma");
  const p = await prisma.package.findUnique({ where: { slug } });
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    currency: p.currency,
    durationDays: p.durationDays,
    matchAllowance: p.matchAllowance,
    features: p.features,
    isPopular: p.isPopular,
    isActive: p.isActive,
  };
}

export async function getPackageById(id: string): Promise<PackageRecord | null> {
  if (!isDatabaseMode()) {
    return demoPackages.find((p) => p.id === id) ?? null;
  }
  const { prisma } = await import("@/lib/db/prisma");
  const p = await prisma.package.findUnique({ where: { id } });
  if (!p) return null;
  return {
    id: p.id, name: p.name, slug: p.slug, description: p.description,
    price: Number(p.price), currency: p.currency, durationDays: p.durationDays,
    matchAllowance: p.matchAllowance, features: p.features,
    isPopular: p.isPopular, isActive: p.isActive,
  };
}

// src/lib/repositories/packages.repository.ts
// Package data access — transparent demo/database switching

import { demoPackages, MatchmakingPackage } from "@/data/demo/packages";
import { isDatabaseMode } from "@/lib/db/mode";

// Normalised type that both demo and DB return
export type PackageRecord = MatchmakingPackage;

export interface PackageInput {
  name: string;
  slug?: string;
  description: string;
  price: number;
  currency?: string;
  durationDays: number;
  matchAllowance: number;
  features: string[];
  isPopular?: boolean;
  isActive?: boolean;
  type?: "ONLINE" | "PHYSICAL";
  sortOrder?: number;
}

export async function getActivePackages(type?: "ONLINE" | "PHYSICAL"): Promise<PackageRecord[]> {
  if (!isDatabaseMode()) {
    return demoPackages.filter((p) => p.isActive && (!type || p.type === type));
  }

  const { prisma } = await import("@/lib/db/prisma");
  const dbPkgs = await prisma.package.findMany({
    where: {
      isActive: true,
      ...(type && { type }),
    },
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
    type: p.type as "ONLINE" | "PHYSICAL",
  }));
}

export async function getAllPackages(type?: "ONLINE" | "PHYSICAL"): Promise<PackageRecord[]> {
  if (!isDatabaseMode()) {
    return demoPackages.filter((p) => !type || p.type === type);
  }
  const { prisma } = await import("@/lib/db/prisma");
  const dbPkgs = await prisma.package.findMany({
    where: {
      ...(type && { type }),
    },
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
    type: p.type as "ONLINE" | "PHYSICAL",
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
    type: p.type as "ONLINE" | "PHYSICAL",
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
    type: p.type as "ONLINE" | "PHYSICAL",
  };
}

export async function updatePackage(id: string, data: Partial<PackageInput>) {
  if (!isDatabaseMode()) return null;
  const { prisma } = await import("@/lib/db/prisma");
  return prisma.package.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.slug && { slug: data.slug }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.currency && { currency: data.currency }),
      ...(data.durationDays !== undefined && { durationDays: data.durationDays }),
      ...(data.matchAllowance !== undefined && { matchAllowance: data.matchAllowance }),
      ...(data.features && { features: data.features }),
      ...(data.isPopular !== undefined && { isPopular: data.isPopular }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.type && { type: data.type }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
    },
  });
}

export async function createPackage(data: PackageInput) {
  if (!isDatabaseMode()) return null;
  const { prisma } = await import("@/lib/db/prisma");
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return prisma.package.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      price: data.price,
      currency: data.currency || "NGN",
      durationDays: data.durationDays,
      matchAllowance: data.matchAllowance,
      features: data.features,
      isPopular: data.isPopular || false,
      isActive: data.isActive !== undefined ? data.isActive : true,
      type: data.type || "ONLINE",
      sortOrder: data.sortOrder || 0,
    },
  });
}

export async function deletePackage(id: string) {
  if (!isDatabaseMode()) return null;
  const { prisma } = await import("@/lib/db/prisma");
  return prisma.package.delete({ where: { id } });
}

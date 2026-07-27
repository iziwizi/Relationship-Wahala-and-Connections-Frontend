// src/lib/repositories/admin-dashboard.repository.ts
// Live database aggregate metrics and operational queues for Super Admin Overview

import { prisma } from "@/lib/db/prisma";
import { isDatabaseMode } from "@/lib/db/mode";

export interface AdminDashboardData {
  stats: {
    totalMembers: number;
    pendingVerifications: number;
    activeSubscriptions: number;
    successfulPaymentsTotal: number;
    pendingBankTransfers: number;
    newEnquiries: number;
    publishedBlogArticles: number;
    podcastEpisodes: number;
  };
  queues: {
    pendingVerifications: Array<{
      id: string;
      name: string;
      profession: string;
      date: string;
      location: string;
    }>;
    pendingTransfers: Array<{
      id: string;
      ref: string;
      user: string;
      package: string;
      amount: string;
      date: string;
    }>;
    recentEnquiries: Array<{
      id: string;
      name: string;
      email: string;
      category: string;
      status: string;
      date: string;
    }>;
  };
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  if (!isDatabaseMode()) {
    // If DB is not connected, return empty operational state (zeroes/empty arrays)
    return {
      stats: {
        totalMembers: 0,
        pendingVerifications: 0,
        activeSubscriptions: 0,
        successfulPaymentsTotal: 0,
        pendingBankTransfers: 0,
        newEnquiries: 0,
        publishedBlogArticles: 0,
        podcastEpisodes: 0,
      },
      queues: {
        pendingVerifications: [],
        pendingTransfers: [],
        recentEnquiries: [],
      },
    };
  }

  try {
    const [
      totalMembers,
      pendingVerificationsCount,
      activeSubscriptionsCount,
      paymentAggregate,
      pendingTransfersCount,
      newEnquiriesCount,
      publishedBlogCount,
      podcastCount,
      pendingProfilesRaw,
      pendingPaymentsRaw,
      recentEnquiriesRaw,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "MEMBER" } }),
      prisma.profile.count({ where: { status: "PENDING_VERIFICATION" } }),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "SUCCESSFUL" },
      }),
      prisma.payment.count({
        where: { provider: "BANK_TRANSFER", status: "PENDING_REVIEW" },
      }),
      prisma.contactEnquiry.count({ where: { status: "NEW" } }),
      prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
      prisma.podcastEpisode.count({ where: { status: "PUBLISHED" } }),

      // Operational queues
      prisma.profile.findMany({
        where: { status: "PENDING_VERIFICATION" },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profession: true,
          currentCityState: true,
          createdAt: true,
        },
      }),

      prisma.payment.findMany({
        where: { provider: "BANK_TRANSFER", status: "PENDING_REVIEW" },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { include: { profile: true } },
          package: true,
        },
      }),

      prisma.contactEnquiry.findMany({
        where: { status: "NEW" },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const successfulPaymentsTotal = Number(paymentAggregate._sum.amount ?? 0);

    const pendingVerifications = pendingProfilesRaw.map((p) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`.trim(),
      profession: p.profession || "Not specified",
      date: new Date(p.createdAt).toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: p.currentCityState || "Nigeria",
    }));

    const pendingTransfers = pendingPaymentsRaw.map((p) => ({
      id: p.id,
      ref: p.reference,
      user: p.user.profile
        ? `${p.user.profile.firstName} ${p.user.profile.lastName}`.trim()
        : p.user.email,
      package: p.package.name,
      amount: `₦${Number(p.amount).toLocaleString()}`,
      date: new Date(p.createdAt).toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    const recentEnquiries = recentEnquiriesRaw.map((e) => ({
      id: e.id,
      name: e.name,
      email: e.email,
      category: e.category,
      status: e.status,
      date: new Date(e.createdAt).toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    return {
      stats: {
        totalMembers,
        pendingVerifications: pendingVerificationsCount,
        activeSubscriptions: activeSubscriptionsCount,
        successfulPaymentsTotal,
        pendingBankTransfers: pendingTransfersCount,
        newEnquiries: newEnquiriesCount,
        publishedBlogArticles: publishedBlogCount,
        podcastEpisodes: podcastCount,
      },
      queues: {
        pendingVerifications,
        pendingTransfers,
        recentEnquiries,
      },
    };
  } catch (error) {
    console.error("[Admin Dashboard Repository] Database query error:", error);
    return {
      stats: {
        totalMembers: 0,
        pendingVerifications: 0,
        activeSubscriptions: 0,
        successfulPaymentsTotal: 0,
        pendingBankTransfers: 0,
        newEnquiries: 0,
        publishedBlogArticles: 0,
        podcastEpisodes: 0,
      },
      queues: {
        pendingVerifications: [],
        pendingTransfers: [],
        recentEnquiries: [],
      },
    };
  }
}

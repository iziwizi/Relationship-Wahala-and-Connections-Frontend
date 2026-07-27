// src/app/api/user/subscription/route.ts
// Returns available packages from DB and the member's active subscription details.

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { isDatabaseMode } from "@/lib/db/mode";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    if (!isDatabaseMode()) {
      // Fallback packages for demo/dev mode
      return NextResponse.json({
        success: true,
        subscription: null,
        packages: [
          {
            id: "pkg-std",
            name: "Standard Matchmaking",
            slug: "standard-matchmaking",
            description: "Ideal for intentional singles starting their guided matchmaking journey.",
            price: 45000,
            currency: "NGN",
            durationDays: 30,
            matchAllowance: 5,
            features: [
              "Vetted Profile Verification",
              "Up to 5 Handpicked Compatible Matches/Month",
              "Basic Personality & Values Alignment",
              "Direct Match Communication",
              "Access to Video Podcast Education",
            ],
            isPopular: false,
            isActive: true,
          },
          {
            id: "pkg-epms",
            name: "Executive Physical Matchmaking (EPMS)",
            slug: "epms-premium",
            description: "Personalised, highly confidential physical & executive matchmaking for discerning individuals.",
            price: 150000,
            currency: "NGN",
            durationDays: 90,
            matchAllowance: 15,
            features: [
              "1-on-1 Private Relationship Consultant",
              "In-Depth Personality & Incompatibility Assessment",
              "Comprehensive Background & Identity Verification",
              "Physical / Virtual Hosted First Date Coordination",
              "Pre-Marital Relationship Readiness Coaching",
              "Ongoing Match Advice & Consultation",
            ],
            isPopular: true,
            isActive: true,
          },
          {
            id: "pkg-vip",
            name: "Global Diaspora VIP",
            slug: "global-vip",
            description: "Dedicated international matchmaking connecting singles across Nigeria, UK, US, and Diaspora.",
            price: 350000,
            currency: "NGN",
            durationDays: 180,
            matchAllowance: 30,
            features: [
              "Priority Global & Diaspora Matchmaking",
              "Dedicated Senior Matchmaker & Relationship Coach",
              "Discreet & Confidential Profile Protection",
              "Unlimited Match Review & Feedback Sessions",
              "Pre-Marital Counseling Package (4 Sessions Included)",
              "24/7 Relationship Support Access",
            ],
            isPopular: false,
            isActive: true,
          },
        ],
      });
    }

    const { prisma } = await import("@/lib/db/prisma");

    // Get active subscription
    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.userId, status: "ACTIVE" },
      include: { package: true },
      orderBy: { startDate: "desc" },
    });

    // Get available packages
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    const formattedSubscription = subscription
      ? {
          id: subscription.id,
          packageId: subscription.packageId,
          packageName: subscription.package.name,
          packageDescription: subscription.package.description,
          packagePrice: Number(subscription.package.price),
          packageDurationDays: subscription.package.durationDays,
          packageFeatures: subscription.package.features,
          matchesRemaining: subscription.matchesRemaining,
          status: subscription.status,
          startDate: subscription.startDate.toISOString(),
          endDate: subscription.endDate.toISOString(),
        }
      : null;

    const formattedPackages = packages.map((p) => ({
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

    return NextResponse.json({
      success: true,
      subscription: formattedSubscription,
      packages: formattedPackages,
    });
  } catch (error) {
    console.error("[User Subscription API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch subscription data." }, { status: 500 });
  }
}

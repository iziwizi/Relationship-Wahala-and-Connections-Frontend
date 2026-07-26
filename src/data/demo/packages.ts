// Demo Matchmaking Packages Schema & Data
// Note: In production, package information will be retrieved dynamically from backend database API.

export interface MatchmakingPackage {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number;
  matchAllowance: number;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export const demoPackages: MatchmakingPackage[] = [
  {
    id: "pkg-basic",
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
    id: "pkg-premium",
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
    id: "pkg-global",
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
];

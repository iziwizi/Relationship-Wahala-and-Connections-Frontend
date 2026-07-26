// prisma/seed.ts
// Database seed for Relationship Wahala & Connections
// Passwords are HASHED using bcryptjs — never stored in plaintext
// Run: npx prisma db seed

import bcrypt from "bcryptjs";
import {
  demoBlogPosts,
  demoPodcasts,
  demoGuides,
  demoSuccessStories,
  demoEvents,
  demoFAQs,
} from "../src/data/demo/cms";

import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from "fs";
import path from "path";

// Load .env.local and .env
function loadEnvFile(filename: string) {
  const filePath = path.resolve(process.cwd(), filename);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnvFile(".env.local");
loadEnvFile(".env");

async function main() {
  const { PrismaClient } = await import("../src/generated/prisma/index.js");
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("🌱 Seeding Relationship Wahala & Connections database...");

  // ─── 1. Hash passwords ────────────────────────────────────
  const adminHash = await bcrypt.hash("Admin@123", 12);
  const memberHash = await bcrypt.hash("Demo@123", 12);

  // ─── 2. Super Admin ───────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@relationshipwahala.com" },
    update: { passwordHash: adminHash },
    create: {
      email: "admin@relationshipwahala.com",
      passwordHash: adminHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });
  console.log(`✅ Admin seeded: ${admin.email}`);

  // ─── 3. Demo Member ───────────────────────────────────────
  const member = await prisma.user.upsert({
    where: { email: "demo@relationshipwahala.com" },
    update: { passwordHash: memberHash },
    create: {
      email: "demo@relationshipwahala.com",
      passwordHash: memberHash,
      role: "MEMBER",
      isActive: true,
      profile: {
        create: {
          firstName: "Daniel",
          lastName: "Okonkwo",
          phone: "+234 801 234 5678",
          dateOfBirth: new Date("1994-03-15"),
          gender: "Male",
          maritalStatus: "Single (Never Married)",
          nationality: "Nigerian",
          stateOfOrigin: "Anambra State",
          currentCityState: "Lekki, Lagos",
          currentCountry: "Nigeria",
          educationLevel: "Master's Degree",
          profession: "Software Technology Consultant",
          employmentStatus: "Full-Time Employed",
          religion: "Christian",
          smoking: "Never",
          drinking: "Socially",
          hasChildren: "No",
          wantsChildren: "Yes",
          aboutMe:
            "I am an intentional and family-oriented professional based in Lagos. I believe great marriages are built on mutual respect, effective communication, and shared values. I enjoy reading, traveling, and hosting intimate dinners with close friends.",
          keyValues: ["Honesty & Transparency", "Faith & Morals", "Continuous Self-Growth", "Emotional Maturity"],
          interestsHobbies: ["Reading", "Chess", "Fitness", "Acoustic Guitar", "Cooking"],
          relationshipGoal: "Marriage within 1-2 years",
          status: "VERIFIED",
          profileCompletion: 85,
          verifiedAt: new Date(),
          preferences: {
            create: {
              ageMin: 25,
              ageMax: 38,
              location: "Nigeria / UK / USA",
              educationLevel: "University Degree and above",
              religion: "Christian",
            },
          },
        },
      },
    },
    include: { profile: true },
  });
  console.log(`✅ Demo member seeded: ${member.email}`);

  // ─── 4. Packages ──────────────────────────────────────────
  const standardPkg = await prisma.package.upsert({
    where: { slug: "standard-matchmaking" },
    update: {},
    create: {
      name: "Standard Matchmaking",
      slug: "standard-matchmaking",
      description: "Ideal for intentional singles starting their guided matchmaking journey.",
      price: 45000.0,
      currency: "NGN",
      durationDays: 30,
      matchAllowance: 5,
      sortOrder: 1,
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
  });

  const epmsPkg = await prisma.package.upsert({
    where: { slug: "epms-premium" },
    update: {},
    create: {
      name: "Executive Physical Matchmaking (EPMS)",
      slug: "epms-premium",
      description: "Personalised, highly confidential executive matchmaking for discerning individuals.",
      price: 150000.0,
      currency: "NGN",
      durationDays: 90,
      matchAllowance: 15,
      sortOrder: 2,
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
  });

  await prisma.package.upsert({
    where: { slug: "global-vip" },
    update: {},
    create: {
      name: "Global Diaspora VIP",
      slug: "global-vip",
      description: "Dedicated international matchmaking connecting singles across Nigeria, UK, US, and Diaspora.",
      price: 350000.0,
      currency: "NGN",
      durationDays: 180,
      matchAllowance: 30,
      sortOrder: 3,
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
  });
  console.log(`✅ Packages seeded`);

  // ─── 5. Subscription ──────────────────────────────────────
  const existingSub = await prisma.subscription.findFirst({
    where: { userId: member.id, status: "ACTIVE" },
  });

  if (!existingSub) {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    await prisma.subscription.create({
      data: {
        userId: member.id,
        packageId: standardPkg.id,
        status: "ACTIVE",
        startDate,
        endDate,
        matchesRemaining: 5,
      },
    });
  }

  // ─── 6. Welcome notification & Enquiry ───────────────────
  await prisma.notification.upsert({
    where: { id: "seed-notif-welcome" },
    update: {},
    create: {
      id: "seed-notif-welcome",
      userId: member.id,
      title: "Welcome to Relationship Wahala & Connections!",
      message: "Your profile has been verified. We are working on handpicking your first compatible matches.",
      isRead: false,
    },
  });

  await prisma.contactEnquiry.upsert({
    where: { id: "seed-enquiry-demo-1" },
    update: {},
    create: {
      id: "seed-enquiry-demo-1",
      name: "Bisi Adebayo",
      email: "bisi@example.com",
      phone: "+234 803 111 2222",
      category: "EPMS",
      message: "I would like to schedule a private EPMS consultation. Please reach out at your earliest convenience.",
      status: "NEW",
    },
  });

  // ─── 7. Platform Settings ─────────────────────────────────
  const defaults = [
    { key: "bank_name", value: "First Bank of Nigeria" },
    { key: "bank_account_name", value: "Relationship Wahala & Connections Ltd" },
    { key: "bank_account_number", value: "3012345678" },
    { key: "bank_transfer_instructions", value: "Include your full name and email in the transfer narration." },
    { key: "paystack_enabled", value: "true" },
    { key: "flutterwave_enabled", value: "true" },
    { key: "bank_transfer_enabled", value: "true" },
  ];

  for (const setting of defaults) {
    await prisma.platformSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: { key: setting.key, value: setting.value },
    });
  }

  // ─── 8. Seed CMS Content ──────────────────────────────────
  for (const p of demoBlogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        author: p.author,
        featuredImage: p.featuredImage,
        featured: p.featured,
        status: "PUBLISHED",
        publishedAt: new Date(p.publishedAt),
      },
    });
  }

  for (const pod of demoPodcasts) {
    await prisma.podcastEpisode.upsert({
      where: { slug: pod.slug },
      update: {},
      create: {
        title: pod.title,
        slug: pod.slug,
        description: pod.description,
        youtubeUrl: pod.youtubeUrl,
        youtubeVideoId: pod.youtubeVideoId,
        thumbnail: pod.thumbnail,
        duration: pod.duration,
        views: pod.views,
        featured: pod.featured,
        status: "PUBLISHED",
        publishedAt: new Date(pod.publishedAt),
      },
    });
  }

  for (const g of demoGuides) {
    await prisma.guide.upsert({
      where: { slug: g.slug },
      update: {},
      create: {
        title: g.title,
        slug: g.slug,
        excerpt: g.excerpt,
        content: g.content,
        category: g.category,
        featuredImage: g.featuredImage,
        featured: g.featured,
        status: "PUBLISHED",
        publishedAt: new Date(g.publishedAt),
      },
    });
  }

  for (const s of demoSuccessStories) {
    await prisma.successStory.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        title: s.title,
        slug: s.slug,
        displayNames: s.displayNames,
        location: s.location,
        weddingDate: s.weddingDate,
        story: s.story,
        photoUrl: s.photoUrl,
        featured: s.featured,
        status: "PUBLISHED",
      },
    });
  }

  for (const ev of demoEvents) {
    await prisma.event.upsert({
      where: { slug: ev.slug },
      update: {},
      create: {
        title: ev.title,
        slug: ev.slug,
        description: ev.description,
        eventDate: new Date(ev.eventDate),
        eventTime: ev.eventTime,
        location: ev.location,
        isOnline: ev.isOnline,
        registrationUrl: ev.registrationUrl,
        image: ev.image,
        status: "PUBLISHED",
      },
    });
  }

  for (const faq of demoFAQs) {
    await prisma.fAQ.upsert({
      where: { id: faq.id },
      update: {},
      create: {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        sortOrder: faq.sortOrder,
        isActive: true,
      },
    });
  }

  console.log("✅ CMS Content (Blog, Podcasts, Guides, Stories, Events, FAQs) seeded!");

  console.log("\n🎉 Database seeded successfully!");
  console.log("─────────────────────────────────────────");
  console.log("Member:  demo@relationshipwahala.com / Demo@123");
  console.log("Admin:   admin@relationshipwahala.com / Admin@123");
  console.log("─────────────────────────────────────────");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});

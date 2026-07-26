import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Relationship Wahala & Connections production database structure...");

  // 1. Seed Packages
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
      features: [
        "Vetted Profile Verification",
        "Up to 5 Handpicked Compatible Matches/Month",
        "Basic Personality & Values Alignment",
        "Direct Match Communication",
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
      description: "Personalised, highly confidential physical & executive matchmaking for discerning individuals.",
      price: 150000.0,
      currency: "NGN",
      durationDays: 90,
      matchAllowance: 15,
      features: [
        "1-on-1 Private Relationship Consultant",
        "In-Depth Personality & Incompatibility Assessment",
        "Comprehensive Background & Identity Verification",
        "Physical / Virtual Hosted First Date Coordination",
      ],
      isPopular: true,
      isActive: true,
    },
  });

  console.log(`Seeded packages: ${standardPkg.name}, ${epmsPkg.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

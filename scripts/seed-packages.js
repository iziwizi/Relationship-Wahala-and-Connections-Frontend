// scripts/seed-packages.js
// Seeds both Online & Physical packages into PostgreSQL database per client specifications

const { PrismaClient } = require('../src/generated/prisma/index.js');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const fs = require('fs');
const path = require('path');

function loadEnvFile(filename) {
  const filePath = path.resolve(process.cwd(), filename);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
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
loadEnvFile('.env.local');
loadEnvFile('.env');

async function seed() {
  console.log('🌱 Seeding Online & Physical Packages into PostgreSQL...');
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // 1. Online Packages
  const onlinePackages = [
    {
      name: 'Standard Matchmaking',
      slug: 'online-standard',
      description: 'Online matchmaking service with access to 20 potential matches.',
      price: 12000,
      currency: 'NGN',
      durationDays: 30,
      matchAllowance: 20,
      features: [
        '20 potential matches',
        '30 Days access',
        'Direct contact details',
      ],
      isPopular: false,
      isActive: true,
      type: 'ONLINE',
      sortOrder: 1,
    },
    {
      name: 'Premium Matchmaking Service',
      slug: 'online-premium',
      description: 'Expanded online matchmaking service with 30 potential matches.',
      price: 17000,
      currency: 'NGN',
      durationDays: 30,
      matchAllowance: 30,
      features: [
        '30 potential matches',
        '30 Days access',
        'Direct contact details',
      ],
      isPopular: true,
      isActive: true,
      type: 'ONLINE',
      sortOrder: 2,
    },
    {
      name: 'Unlimited Matchmaking Service',
      slug: 'online-unlimited',
      description: 'Comprehensive 1-year online matchmaking with unlimited match access.',
      price: 100000,
      currency: 'NGN',
      durationDays: 365,
      matchAllowance: 9999,
      features: [
        'Unlimited matches',
        'One year access',
        'Direct contact details',
      ],
      isPopular: false,
      isActive: true,
      type: 'ONLINE',
      sortOrder: 3,
    },
  ];

  // 2. Physical Packages
  const physicalPackages = [
    {
      name: 'Standard Matchmaking',
      slug: 'physical-standard',
      description: 'In-person consultation and curated introductions with full vetting.',
      price: 30000,
      currency: 'NGN',
      durationDays: 30,
      matchAllowance: 3,
      features: [
        'Registration & Profile Creation',
        'In-depth consultation',
        'Background screening',
        'Multiple curated introductions (three introductions)',
        'Coaching and feedbacks',
        'Limited follow-up',
      ],
      isPopular: false,
      isActive: true,
      type: 'PHYSICAL',
      sortOrder: 1,
    },
    {
      name: 'Premium Matchmaking',
      slug: 'physical-premium',
      description: 'Dedicated matchmaker, concierge-style service, high privacy, and ongoing support.',
      price: 120000,
      currency: 'NGN',
      durationDays: 90,
      matchAllowance: 10,
      features: [
        'Dedicated matchmaker',
        'Multiple introductions (as many as possible)',
        'Extensive vetting',
        'Ongoing support',
        'Concierge-style service and high privacy',
      ],
      isPopular: true,
      isActive: true,
      type: 'PHYSICAL',
      sortOrder: 2,
    },
  ];

  for (const pkg of [...onlinePackages, ...physicalPackages]) {
    const upserted = await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {
        name: pkg.name,
        description: pkg.description,
        price: pkg.price,
        currency: pkg.currency,
        durationDays: pkg.durationDays,
        matchAllowance: pkg.matchAllowance,
        features: pkg.features,
        isPopular: pkg.isPopular,
        isActive: pkg.isActive,
        type: pkg.type,
        sortOrder: pkg.sortOrder,
      },
      create: pkg,
    });
    console.log(`✅ Upserted ${pkg.type} package: ${upserted.name} (₦${Number(upserted.price).toLocaleString()})`);
  }

  console.log('🎉 Package seeding complete!');
  await prisma.$disconnect();
}

seed().catch(err => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});

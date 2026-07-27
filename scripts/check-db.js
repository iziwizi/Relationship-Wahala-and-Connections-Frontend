const { PrismaClient } = require('../src/generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('\n=== DATABASE STATE ===\n');

  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  console.log('USERS:', JSON.stringify(users, null, 2));

  const profiles = await prisma.profile.findMany({
    select: { userId: true, firstName: true, lastName: true, gender: true, status: true },
  });
  console.log('PROFILES:', JSON.stringify(profiles, null, 2));

  const counts = {
    totalUsers: await prisma.user.count(),
    members: await prisma.user.count({ where: { role: 'MEMBER' } }),
    superAdmins: await prisma.user.count({ where: { role: 'SUPER_ADMIN' } }),
    verifiedProfiles: await prisma.profile.count({ where: { status: 'VERIFIED' } }),
    pendingProfiles: await prisma.profile.count({ where: { status: 'PENDING_VERIFICATION' } }),
    activeSubscriptions: await prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    matchInteractions: await prisma.matchInteraction.count(),
    contactEnquiries: await prisma.contactEnquiry.count(),
  };
  console.log('\nCOUNTS:', JSON.stringify(counts, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

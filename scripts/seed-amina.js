// UAT seed: Create Amina Bello (testmatch@relationshipwahala.com)
// Safe to run multiple times — uses upsert
const { PrismaClient } = require('../src/generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Creating Amina Bello UAT account...');

  const passwordHash = await bcrypt.hash('Demo@123', 12);

  // Create or update user
  const user = await prisma.user.upsert({
    where: { email: 'testmatch@relationshipwahala.com' },
    update: { isActive: true },
    create: {
      email: 'testmatch@relationshipwahala.com',
      passwordHash,
      role: 'MEMBER',
      isActive: true,
    },
  });

  console.log('User:', user.id, user.email);

  // Create or update profile
  const existing = await prisma.profile.findUnique({ where: { userId: user.id } });

  if (!existing) {
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        firstName: 'Amina',
        lastName: 'Bello',
        phone: '+2348012345679',
        dateOfBirth: new Date('1993-04-15'),
        gender: 'Female',
        maritalStatus: 'Single',
        nationality: 'Nigerian',
        stateOfOrigin: 'Kano',
        currentCityState: 'Abuja, FCT',
        currentCountry: 'Nigeria',
        educationLevel: "Bachelor's Degree",
        profession: 'Educator',
        employmentStatus: 'Employed',
        religion: 'Islam',
        smoking: 'Never',
        drinking: 'Never',
        hasChildren: 'No',
        wantsChildren: 'Yes',
        aboutMe: 'A dedicated educator with a passion for knowledge and family values. Seeking a God-fearing, ambitious life partner.',
        keyValues: ['Faith', 'Education', 'Family', 'Integrity'],
        interestsHobbies: ['Reading', 'Cooking', 'Travelling', 'Mentoring'],
        relationshipGoal: 'Marriage',
        profileCompletion: 90,
        status: 'VERIFIED',
        verifiedAt: new Date(),
      },
    });
    console.log('Profile created:', profile.id, 'Status:', profile.status);
  } else {
    // Ensure existing profile is VERIFIED
    const profile = await prisma.profile.update({
      where: { userId: user.id },
      data: { status: 'VERIFIED', verifiedAt: new Date() },
    });
    console.log('Profile updated:', profile.id, 'Status:', profile.status);
  }

  // Re-query to confirm
  const check = await prisma.user.findUnique({
    where: { email: 'testmatch@relationshipwahala.com' },
    include: { profile: { select: { firstName: true, lastName: true, gender: true, status: true } } },
  });
  console.log('\nFINAL CHECK:', JSON.stringify(check ? {
    email: check.email, role: check.role, isActive: check.isActive,
    profile: check.profile
  } : 'NOT FOUND', null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

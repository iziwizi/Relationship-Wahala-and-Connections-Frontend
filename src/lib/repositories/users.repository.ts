// src/lib/repositories/users.repository.ts
// User + Profile data access — demo/database transparent

import { isDatabaseMode } from "@/lib/db/mode";

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: Date;
  gender: string;
  maritalStatus: string;
  nationality: string;
  stateOfOrigin?: string;
  currentCityState: string;
  currentCountry: string;
  educationLevel: string;
  profession: string;
  employmentStatus: string;
  religion?: string;
  smoking: string;
  drinking: string;
  hasChildren: string;
  wantsChildren: string;
  aboutMe: string;
  keyValues: string[];
  interestsHobbies: string[];
  relationshipGoal: string;
  prefAgeMin: number;
  prefAgeMax: number;
  prefLocation?: string;
}

export async function createUserWithProfile(data: CreateUserInput) {
  if (!isDatabaseMode()) {
    return { id: `demo-user-${Date.now()}`, email: data.email };
  }

  const { prisma } = await import("@/lib/db/prisma");

  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      role: "MEMBER",
      profile: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          maritalStatus: data.maritalStatus,
          nationality: data.nationality,
          stateOfOrigin: data.stateOfOrigin,
          currentCityState: data.currentCityState,
          currentCountry: data.currentCountry,
          educationLevel: data.educationLevel,
          profession: data.profession,
          employmentStatus: data.employmentStatus,
          religion: data.religion,
          smoking: data.smoking,
          drinking: data.drinking,
          hasChildren: data.hasChildren,
          wantsChildren: data.wantsChildren,
          aboutMe: data.aboutMe,
          keyValues: data.keyValues,
          interestsHobbies: data.interestsHobbies,
          relationshipGoal: data.relationshipGoal,
          status: "SUBMITTED",
          profileCompletion: 70,
          preferences: {
            create: {
              ageMin: data.prefAgeMin,
              ageMax: data.prefAgeMax,
              location: data.prefLocation,
            },
          },
        },
      },
    },
    include: { profile: true },
  });
}

export async function getUserByEmail(email: string) {
  if (!isDatabaseMode()) return null;
  const { prisma } = await import("@/lib/db/prisma");
  return prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { profile: true },
  });
}

export async function getUserById(id: string) {
  if (!isDatabaseMode()) return null;
  const { prisma } = await import("@/lib/db/prisma");
  return prisma.user.findUnique({
    where: { id },
    include: { profile: { include: { photos: true, preferences: true } } },
  });
}

export async function emailExists(email: string): Promise<boolean> {
  if (!isDatabaseMode()) return false;
  const { prisma } = await import("@/lib/db/prisma");
  const count = await prisma.user.count({ where: { email: email.toLowerCase().trim() } });
  return count > 0;
}

export async function updateLastLogin(userId: string) {
  if (!isDatabaseMode()) return;
  const { prisma } = await import("@/lib/db/prisma");
  await prisma.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } });
}

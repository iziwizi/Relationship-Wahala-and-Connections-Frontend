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
  photoUrl?: string;
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
          profileCompletion: 80,
          photos: data.photoUrl
            ? {
                create: {
                  url: data.photoUrl,
                  isPrimary: true,
                },
              }
            : undefined,
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
    include: { profile: { include: { photos: true, preferences: true } } },
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

export async function getAllProfiles() {
  if (!isDatabaseMode()) return [];
  const { prisma } = await import("@/lib/db/prisma");
  return prisma.profile.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateProfileStatus(
  profileId: string,
  status: "DRAFT" | "SUBMITTED" | "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED" | "SUSPENDED",
  adminUserId: string,
  rejectionReason?: string
) {
  if (!isDatabaseMode()) return null;
  const { prisma } = await import("@/lib/db/prisma");

  const updatedProfile = await prisma.profile.update({
    where: { id: profileId },
    data: {
      status,
      verifiedAt: status === "VERIFIED" ? new Date() : undefined,
      verifiedByAdminId: status === "VERIFIED" ? adminUserId : undefined,
      rejectionReason: status === "REJECTED" ? rejectionReason : undefined,
    },
    include: { user: true },
  });

  // Log action in AdminAuditLog
  await prisma.adminAuditLog.create({
    data: {
      adminId: adminUserId,
      action: `PROFILE_${status}`,
      targetType: "Profile",
      targetId: profileId,
      details: {
        userId: updatedProfile.userId,
        userName: `${updatedProfile.firstName} ${updatedProfile.lastName}`,
        status,
        rejectionReason,
      },
    },
  });

  // Create in-app Notification for the member
  let notificationTitle = "Profile Status Updated";
  let notificationMessage = `Your profile status has been updated to ${status}.`;

  if (status === "VERIFIED") {
    notificationTitle = "Profile Verified! 🎉";
    notificationMessage = "Congratulations! Your profile has been verified by Relationship Wahala & Connections moderators.";
  } else if (status === "REJECTED") {
    notificationTitle = "Profile Revision Required";
    notificationMessage = `Your profile requires updates: ${rejectionReason || "Please review your information."}`;
  }

  await prisma.notification.create({
    data: {
      userId: updatedProfile.userId,
      title: notificationTitle,
      message: notificationMessage,
      link: "/dashboard/profile",
    },
  });

  return updatedProfile;
}


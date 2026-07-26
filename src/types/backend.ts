// Database Relational Models Schema Definition
// Production database choice: PostgreSQL with Prisma ORM / Drizzle ORM

export type UserRole = "MEMBER" | "SUPER_ADMIN";

export type ProfileStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "REJECTED"
  | "SUSPENDED";

export type PaymentStatus = "SUCCESSFUL" | "PENDING" | "FAILED" | "REFUNDED";

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileEntity {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: Date;
  gender: string;
  maritalStatus: string;
  nationality: string;
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
  status: ProfileStatus;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchPreferenceEntity {
  id: string;
  profileId: string;
  ageMin: number;
  ageMax: number;
  location?: string;
  educationLevel?: string;
  religion?: string;
  lifestyle?: string;
  relocationPreference?: string;
}

export interface PhotoEntity {
  id: string;
  profileId: string;
  url: string;
  isPrimary: boolean;
  uploadedAt: Date;
}

export interface PackageEntity {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number;
  matchAllowance: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionEntity {
  id: string;
  userId: string;
  packageId: string;
  startDate: Date;
  endDate: Date;
  matchesRemaining: number;
  isActive: boolean;
}

export interface PaymentEntity {
  id: string;
  userId: string;
  packageId: string;
  reference: string;
  amount: number;
  currency: string;
  gateway: string;
  gatewayTransactionId?: string;
  status: PaymentStatus;
  verifiedAt?: Date;
  createdAt: Date;
}

export interface MatchInteractionEntity {
  id: string;
  requesterId: string;
  targetId: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
  compatibilityScore: number;
  createdAt: Date;
}

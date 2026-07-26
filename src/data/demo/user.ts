// Demo Customer Profile — Daniel Okonkwo

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  profileCompletion: number;
  basicInfo: {
    age: number;
    gender: string;
    maritalStatus: string;
    genotype: string;
    bloodGroup: string;
    height: string;
    religion: string;
  };
  aboutMe: string;
  location: {
    city: string;
    state: string;
    country: string;
    relocationPreference: string;
  };
  educationCareer: {
    educationLevel: string;
    fieldOfStudy: string;
    occupation: string;
    company: string;
    employmentStatus: string;
  };
  lifestyle: {
    diet: string;
    smoking: string;
    drinking: string;
    hobbies: string[];
  };
  intentions: {
    relationshipGoal: string;
    timeframeToMarriage: string;
    childrenIntention: string;
    keyValues: string[];
  };
  photos: string[];
}

export const demoUser: UserProfile = {
  id: "user-101",
  firstName: "Daniel",
  lastName: "Okonkwo",
  email: "demo@relationshipwahala.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
  profileCompletion: 75,
  basicInfo: {
    age: 32,
    gender: "Male",
    maritalStatus: "Single (Never Married)",
    genotype: "AA",
    bloodGroup: "O+",
    height: "6'1\"",
    religion: "Christian",
  },
  aboutMe:
    "I am an intentional and family-oriented software consultant based in Lagos. I believe great marriages are built on mutual respect, effective communication, and shared values. I enjoy reading, traveling, and hosting intimate dinners with close friends.",
  location: {
    city: "Lekki, Lagos",
    state: "Lagos State",
    country: "Nigeria",
    relocationPreference: "Open to relocating within Nigeria or abroad",
  },
  educationCareer: {
    educationLevel: "Master's Degree",
    fieldOfStudy: "Computer Science & Business Administration",
    occupation: "Senior Technology Consultant",
    company: "TechNexus Global",
    employmentStatus: "Full-Time Employed",
  },
  lifestyle: {
    diet: "Non-Vegetarian",
    smoking: "Never",
    drinking: "Socially",
    hobbies: ["Reading", "Chess", "Fitness", "Acoustic Guitar", "Cooking"],
  },
  intentions: {
    relationshipGoal: "Marriage within 1-2 years",
    timeframeToMarriage: "12 - 18 Months",
    childrenIntention: "Wants children (2-3)",
    keyValues: ["Honesty & Transparency", "Faith & Morals", "Continuous Self-Growth", "Emotional Maturity"],
  },
  photos: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&q=80",
  ],
};

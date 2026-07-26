// Demo Matches Data for Relationship Wahala & Connections

export interface MatchProfile {
  id: string;
  firstName: string;
  age: number;
  location: string;
  profession: string;
  education: string;
  maritalStatus: string;
  religion: string;
  compatibility: number;
  photo: string;
  gallery: string[];
  shortDescription: string;
  about: string;
  interests: string[];
  relationshipIntentions: string;
  verified: boolean;
}

export const demoMatches: MatchProfile[] = [
  {
    id: "match-1",
    firstName: "Amara",
    age: 29,
    location: "Lagos, Nigeria",
    profession: "Marketing Executive",
    education: "B.Sc. Mass Communication",
    maritalStatus: "Single (Never Married)",
    religion: "Christian",
    compatibility: 94,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
    ],
    shortDescription: "Passionate brand strategist who values deep conversations, family, and personal growth.",
    about:
      "I am an energetic yet grounded marketing professional living in Lagos. I love exploring new cultural events, hosting weekend dinners, and learning about relationship psychology. I am seeking a mature, intentional partner who values open communication and mutual encouragement.",
    interests: ["Brand Strategy", "Interior Design", "Podcasts", "Baking", "Travel"],
    relationshipIntentions: "Intentional dating leading to marriage within 1-2 years.",
    verified: true,
  },
  {
    id: "match-2",
    firstName: "Zainab",
    age: 28,
    location: "Abuja, Nigeria",
    profession: "Legal Practitioner & Policy Advisor",
    education: "LL.B, BL, LL.M Corporate Law",
    maritalStatus: "Single (Never Married)",
    religion: "Muslim (Moderate)",
    compatibility: 91,
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
    ],
    shortDescription: "Focused legal practitioner passionate about justice, good governance, and family stability.",
    about:
      "Based in Abuja, I advocate for women's development and policy reform. Off-duty, I am an avid reader and home chef. I am looking for a compassionate, intellectually engaging, and respectful partner.",
    interests: ["Policy Reform", "Classical Literature", "Art Galleries", "Cooking"],
    relationshipIntentions: "Marriage-focused intentional partnership.",
    verified: true,
  },
  {
    id: "match-3",
    firstName: "Dr. Chioma",
    age: 31,
    location: "Lagos, Nigeria",
    profession: "Consultant Physician",
    education: "MBBS, FWACP Internal Medicine",
    maritalStatus: "Single (Never Married)",
    religion: "Christian",
    compatibility: 88,
    photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&q=80",
    ],
    shortDescription: "Dedicated medical consultant with a heart for service, wellness, and quiet weekend getaways.",
    about:
      "Balancing a clinical career with wellness advocacy. I value emotional intelligence, kindness, and humor. Looking for a partner who is confident, supportive, and ready for a purposeful marriage.",
    interests: ["Wellness", "Classical Music", "Hiking", "Mentorship"],
    relationshipIntentions: "Marriage in 12-18 months.",
    verified: true,
  },
  {
    id: "match-4",
    firstName: "Kemi",
    age: 30,
    location: "London, UK (Nigerian Diaspora)",
    profession: "Senior Financial Analyst",
    education: "M.Sc. Finance & Investment",
    maritalStatus: "Single (Never Married)",
    religion: "Christian",
    compatibility: 87,
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
    ],
    shortDescription: "London-based financial analyst connected to her roots, open to relocation or diaspora match.",
    about:
      "Working in London's financial district, I appreciate both global opportunities and African cultural values. Looking for a partner who values ambition, faith, and mutual support.",
    interests: ["Financial Markets", "Theater", "Afrobeats", "Fitness"],
    relationshipIntentions: "Intentional relationship leading to marriage.",
    verified: true,
  },
  {
    id: "match-5",
    firstName: "Nneka",
    age: 27,
    location: "Port Harcourt, Nigeria",
    profession: "Architectural Designer",
    education: "M.Arch. Architecture",
    maritalStatus: "Single (Never Married)",
    religion: "Christian",
    compatibility: 85,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    ],
    shortDescription: "Creative architect who loves sustainable building, photography, and meaningful conversations.",
    about:
      "I design spaces that inspire. I bring creativity, warmth, and structure into everything I do. I am seeking a partner with clear vision, strong morals, and a loving heart.",
    interests: ["Architecture", "Photography", "Acoustic Music", "Nature"],
    relationshipIntentions: "Serious relationship with marriage as the end goal.",
    verified: true,
  },
  {
    id: "match-6",
    firstName: "Grace",
    age: 29,
    location: "Ibadan, Nigeria",
    profession: "Human Resource Manager",
    education: "B.Sc. Industrial Relations",
    maritalStatus: "Single (Never Married)",
    religion: "Christian",
    compatibility: 84,
    photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80",
    ],
    shortDescription: "Warm HR professional committed to people development, faith, and family harmony.",
    about:
      "People are my passion. I enjoy organizing community outreach programs and spending quality time with family. I am searching for a trustworthy and grounded partner.",
    interests: ["HR Development", "Community Service", "Gospel Music", "Reading"],
    relationshipIntentions: "Intentional dating leading to marriage.",
    verified: true,
  },
];

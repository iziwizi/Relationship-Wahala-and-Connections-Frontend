// Testimonials data — 5 authentic Nigerian & African success stories

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
  avatar: string;
  avatarAlt: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "tunde-aminat",
    quote:
      "Relationship Wahala & Connections helped us navigate hard conversations before marriage. Today, we're happily married and forever grateful for the knowledge-first approach.",
    name: "Tunde & Aminat",
    location: "Lagos, Nigeria",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    avatarAlt: "Tunde and Aminat couple portrait",
  },
  {
    id: "nkechi-emeka",
    quote:
      "Finding a genuinely intentional partner in Lagos felt impossible until EPMS connected us. We shared identical life visions, family values, and relationship goals.",
    name: "Nkechi & Emeka",
    location: "Abuja, Nigeria",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80",
    avatarAlt: "Nkechi & Emeka portrait",
  },
  {
    id: "david-sarah",
    quote:
      "The pre-marital counseling sessions opened our eyes to hidden red flags and communication gaps long before we said 'I do'. Best decision we ever made!",
    name: "David & Sarah",
    location: "London, UK (Diaspora)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    avatarAlt: "David and Sarah couple portrait",
  },
  {
    id: "funke-femi",
    quote:
      "We lived in different countries, but RWC bridged the distance seamlessly. Their global matchmaking team paired us with total discretion and commitment.",
    name: "Funke & Femi",
    location: "Toronto, Canada & Lagos",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&q=80",
    avatarAlt: "Funke and Femi portrait",
  },
  {
    id: "ibrahim-zainab",
    quote:
      "The video podcast gave us practical tools for conflict resolution, and the guided matchmaking brought us together with complete confidentiality.",
    name: "Ibrahim & Zainab",
    location: "Kano, Nigeria",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    avatarAlt: "Ibrahim and Zainab portrait",
  },
];

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
    avatar: "/images/testimonials/tunde-aminat.jpg",
    avatarAlt: "Tunde and Aminat couple portrait",
  },
  {
    id: "nkechi-emeka",
    quote:
      "Finding a genuinely intentional partner in Lagos felt impossible until EPMS connected us. We shared identical life visions, family values, and relationship goals.",
    name: "Nkechi & Emeka",
    location: "Abuja, Nigeria",
    avatar: "/images/testimonials/nkechi-emeka.jpg",
    avatarAlt: "Nkechi & Emeka portrait",
  },
  {
    id: "david-sarah",
    quote:
      "The pre-marital counseling sessions opened our eyes to hidden red flags and communication gaps long before we said 'I do'. Best decision we ever made!",
    name: "David & Sarah",
    location: "London, UK (Diaspora)",
    avatar: "/images/testimonials/david-sarah.jpg",
    avatarAlt: "David and Sarah couple portrait",
  },
  {
    id: "funke-femi",
    quote:
      "We lived in different countries, but RWC bridged the distance seamlessly. Their global matchmaking team paired us with total discretion and commitment.",
    name: "Funke & Femi",
    location: "Toronto, Canada & Lagos",
    avatar: "/images/testimonials/funke-femi.jpg",
    avatarAlt: "Funke and Femi portrait",
  },
  {
    id: "ibrahim-zainab",
    quote:
      "The video podcast gave us practical tools for conflict resolution, and the guided matchmaking brought us together with complete confidentiality.",
    name: "Ibrahim & Zainab",
    location: "Kano, Nigeria",
    avatar: "/images/testimonials/ibrahim-zainab.jpg",
    avatarAlt: "Ibrahim and Zainab portrait",
  },
];

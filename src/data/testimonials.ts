// Testimonials data — placeholder content for future database integration

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
      "RWC helped us discover things we never talked about before marriage. Today, we're happily married and forever grateful.",
    name: "Tunde & Aminat",
    location: "Lagos, Nigeria",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    avatarAlt: "Tunde and Aminat couple portrait",
  },
  {
    id: "nkechi",
    quote:
      "As a single mum, I thought love had passed me by. Through RWC, I found a partner who truly understands and values me.",
    name: "Nkechi",
    location: "Abuja, Nigeria",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    avatarAlt: "Nkechi portrait",
  },
  {
    id: "david-sarah",
    quote:
      "The counseling session opened our eyes to our strengths and weaknesses. Best decision we made!",
    name: "David & Sarah",
    location: "United Kingdom",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    avatarAlt: "David and Sarah couple portrait",
  },
];

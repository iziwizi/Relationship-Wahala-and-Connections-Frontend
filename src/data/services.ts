// Services data — separated from presentation for future CMS/API integration

export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: string; // Lucide icon name
  ctaLabel: string;
  ctaHref: string;
}

export const services: Service[] = [
  {
    id: "intentional-matchmaking",
    title: "Intentional Matchmaking",
    description:
      "We connect compatible singles locally and globally, focusing on shared values, vision, and long-term marital compatibility.",
    image: "/images/service-matchmaking.jpg",
    imageAlt: "Elegant Black Africans at a matchmaking event",
    icon: "Users",
    ctaLabel: "Learn More",
    ctaHref: "/matchmaking",
  },
  {
    id: "pre-marital-counseling",
    title: "Pre-Marital Counseling",
    description:
      "Discover the hidden parts of each other, identify red flags, and build a solid foundation before you say \"I do.\"",
    image: "/images/service-counseling.jpg",
    imageAlt: "Couple in a pre-marital counseling session",
    icon: "Heart",
    ctaLabel: "Learn More",
    ctaHref: "/services#pre-marital-counseling",
  },
  {
    id: "relationship-marital-solutions",
    title: "Relationship & Marital Solutions",
    description:
      "Access expert advice, digital resources and practical guides to navigate dating, relationships and marriage.",
    image: "/images/service-resources.jpg",
    imageAlt: "Relationship education books and resources",
    icon: "BookOpen",
    ctaLabel: "Learn More",
    ctaHref: "/services#relationship-solutions",
  },
  {
    id: "video-podcast",
    title: "The Video Podcast",
    description:
      "Raw, insightful and expert-driven conversations about love, dating, marriage, conflict resolution and marital success.",
    image: "/images/service-podcast.jpg",
    imageAlt: "Podcast host at a professional microphone setup",
    icon: "Mic",
    ctaLabel: "Watch Now",
    ctaHref: "/podcast",
  },
];

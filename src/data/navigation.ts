// Navigation data — structured for future CMS/dynamic integration

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  {
    label: "Matchmaking",
    href: "/matchmaking",
    children: [
      { label: "Intentional Matchmaking", href: "/matchmaking" },
      { label: "Executive Physical Matchmaking (EPMS)", href: "/epms" },
      { label: "Matchmaking Packages", href: "/pricing" },
    ],
  },
  { label: "Podcast", href: "/podcast" },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Blog", href: "/resources/blog" },
      { label: "Relationship Guides", href: "/resources/guides" },
      { label: "Success Stories", href: "/resources/success-stories" },
      { label: "Events", href: "/resources/events" },
      { label: "FAQs", href: "/resources/faqs" },
    ],
  },
  { label: "Contact Us", href: "/contact" },
];

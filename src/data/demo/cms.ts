// Demo CMS Content — Authentic Nigerian & African Relationship Articles, Guides, Podcasts, Events & FAQs

export interface DemoBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  featuredImage: string;
  featured: boolean;
}

export interface DemoPodcastEpisode {
  id: string;
  title: string;
  slug: string;
  description: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: string;
  featured: boolean;
}

export interface DemoGuide {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage: string;
  publishedAt: string;
  featured: boolean;
}

export interface DemoSuccessStory {
  id: string;
  title: string;
  slug: string;
  displayNames: string;
  location: string;
  weddingDate: string;
  story: string;
  photoUrl: string;
  featured: boolean;
}

export interface DemoEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  isOnline: boolean;
  registrationUrl: string;
  image: string;
}

export interface DemoFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

// ─── 1. Blog Posts ──────────────────────────────────────────
export const demoBlogPosts: DemoBlogPost[] = [
  {
    id: "blog-1",
    title: "5 Crucial Pre-Marital Conversations Every Nigerian Couple Must Have",
    slug: "5-crucial-pre-marital-conversations-nigerian-couples",
    excerpt: "Before saying 'I do', discussing finances, extended family boundaries, genotype compatibility, and career ambitions is essential for a lasting union.",
    category: "Pre-Marital Preparation",
    author: "Faruq & Relationship Wahala Team",
    publishedAt: "2026-07-10",
    featuredImage: "/images/service-counseling.jpg",
    featured: true,
    content: `
      Marriage in an African context is not merely the union of two individuals; it is the joining of two families, lineages, and financial histories. Yet many couples walk down the aisle without having thoroughly explored the key areas that determine marital longevity.

      ### 1. Financial Intimacy and Money Management
      Money is one of the top causes of marital friction. Before marriage, discuss:
      - How will household expenses be split?
      - Are we combining accounts, maintaining separate accounts, or using a hybrid model?
      - How much financial support are we expected to provide to extended family members?

      ### 2. Genotype and Medical Compatibility
      In Nigeria, AA, AS, and SS genotype combinations are critical considerations. Obtaining verifiable medical checks before deep emotional commitment prevents tragic, preventable heartbreak.

      ### 3. Extended Family Involvement and Boundaries
      Establishing clear, respectful boundaries with in-laws while honouring cultural values requires open agreement between partners.

      ### 4. Career Aspirations and Relocation Intentions
      Will one partner's job require international relocation (e.g. 'Japa')? How do both partners feel about career pauses for child-rearing?

      ### 5. Spiritual Alignment and Values
      Shared moral and spiritual values provide the foundation for resolving conflict when difficulties arise.
    `,
  },
  {
    id: "blog-2",
    title: "Understanding 'Japa' Dynamics in Modern Nigerian Relationships",
    slug: "understanding-japa-dynamics-nigerian-relationships",
    excerpt: "Navigating long-distance relationships and relocation challenges when one partner moves abroad while the other remains in Nigeria.",
    category: "Relationship Growth",
    author: "Dr. Kemi Adebayo",
    publishedAt: "2026-07-02",
    featuredImage: "/images/service-resources.jpg",
    featured: false,
    content: `
      Relocation (popularly termed 'Japa') has reshaped modern Nigerian courting and marital dynamics. When partners are separated across time zones, intentional communication becomes the bedrock of trust.

      ### Key Strategies for Long-Distance Intimacy:
      - **Scheduled Virtual Dates:** Treat video calls with the same seriousness as physical dates.
      - **Transparent Financial Planning:** Clear visa application timelines and cost expectations reduce resentment.
      - **Mutual Goal Reassurance:** Consistently remind each other of the ultimate vision: reuniting to build a strong home together.
    `,
  },
  {
    id: "blog-3",
    title: "How EPMS Vetting Protects Singles Against Deception & Fraud",
    slug: "how-epms-vetting-protects-singles-against-deception",
    excerpt: "Why Executive Physical Matchmaking Service (EPMS) prioritises multi-tier background checks, identity verification, and personality profiling.",
    category: "Matchmaking & Safety",
    author: "Relationship Wahala Editorial",
    publishedAt: "2026-06-25",
    featuredImage: "/images/service-matchmaking.jpg",
    featured: false,
    content: `
      In an era of online catfishing, dishonest marital status declarations, and financial scams, safety and confidentiality are paramount. EPMS ensures that every participant undergoes rigorous identity checks, employment verification, and singlehood confirmation before introduction.
    `,
  },
  {
    id: "blog-4",
    title: "The Role of Emotional Intelligence in Resolving Marital Conflicts",
    slug: "role-of-emotional-intelligence-in-marital-conflicts",
    excerpt: "Discover how self-awareness, active listening, and emotional regulation prevent minor misunderstandings from escalating into relationship crisis.",
    category: "Conflict Resolution",
    author: "Pastor Samuel Okafor",
    publishedAt: "2026-06-18",
    featuredImage: "/images/video-thumb-1.jpg",
    featured: false,
    content: `
      Conflict in marriage is inevitable; destruction is optional. Couples who master emotional regulation understand that the goal of an argument is resolution, not victory over their spouse.
    `,
  },
  {
    id: "blog-5",
    title: "Transitioning from Singlehood to Intentionally Dating for Marriage",
    slug: "transitioning-from-singlehood-to-intentional-dating",
    excerpt: "Shifting your mindset from casual dating to goal-oriented, intentional relationship building that leads to a successful marriage.",
    category: "Intentional Dating",
    author: "Relationship Wahala Team",
    publishedAt: "2026-06-10",
    featuredImage: "/images/service-podcast.jpg",
    featured: false,
    content: `
      Dating with intention requires clarity regarding your values, non-negotiables, and ideal life path. When you know what you are building, you attract partners with similar commitment levels.
    `,
  },
];

// ─── 2. Podcast Episodes ────────────────────────────────────
export const demoPodcasts: DemoPodcastEpisode[] = [
  {
    id: "pod-1",
    title: "EP 01: Why Most Nigerian Relationships Fail Before Marriage",
    slug: "ep-01-why-relationships-fail-before-marriage",
    description: "In this debut episode of Relationship Wahala, we discuss the unspoken assumptions, lack of financial clarity, and family pressure that destroy promising relationships before wedding planning begins.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeVideoId: "dQw4w9WgXcQ",
    thumbnail: "/images/video-thumb-1.jpg",
    duration: "45 mins",
    views: "14.2k views",
    publishedAt: "2026-06-01",
    featured: true,
  },
  {
    id: "pod-2",
    title: "EP 02: Navigating Money, In-Laws & Intimacy in Early Marriage",
    slug: "ep-02-navigating-money-in-laws-intimacy",
    description: "An open, transparent discussion on setting financial boundaries with in-laws while building deep emotional and physical intimacy during the first two years of marriage.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeVideoId: "dQw4w9WgXcQ",
    thumbnail: "/images/service-counseling.jpg",
    duration: "52 mins",
    views: "9.8k views",
    publishedAt: "2026-06-15",
    featured: false,
  },
  {
    id: "pod-3",
    title: "EP 03: Executive Matchmaking — Finding Love in High-Stress Careers",
    slug: "ep-03-executive-matchmaking-high-stress-careers",
    description: "How busy corporate leaders, doctors, legal professionals, and tech founders navigate dating and find compatible life partners through EPMS.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeVideoId: "dQw4w9WgXcQ",
    thumbnail: "/images/service-matchmaking.jpg",
    duration: "38 mins",
    views: "11.5k views",
    publishedAt: "2026-07-01",
    featured: false,
  },
  {
    id: "pod-4",
    title: "EP 04: Healing From Heartbreak & Re-opening Your Heart to Love",
    slug: "ep-04-healing-from-heartbreak-reopening-heart",
    description: "Practical emotional healing strategies for individuals recovering from broken engagements, painful breakups, or divorce who are ready for healthy new beginnings.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeVideoId: "dQw4w9WgXcQ",
    thumbnail: "/images/service-podcast.jpg",
    duration: "48 mins",
    views: "7.3k views",
    publishedAt: "2026-07-15",
    featured: false,
  },
];

// ─── 3. Guides ──────────────────────────────────────────────
export const demoGuides: DemoGuide[] = [
  {
    id: "guide-1",
    title: "The Ultimate Pre-Marital Readiness Checklist",
    slug: "ultimate-pre-marital-readiness-checklist",
    excerpt: "A step-by-step diagnostic guide to evaluate your emotional, financial, and relational readiness for marriage.",
    category: "Pre-Marital Preparation",
    featuredImage: "/images/service-counseling.jpg",
    publishedAt: "2026-06-10",
    featured: true,
    content: `
      ### Chapter 1: Emotional Readiness
      - Have you processed and healed from past emotional wounds?
      - Can you communicate your needs without blame or anger?
      
      ### Chapter 2: Financial Transparency
      - Complete breakdown of individual income, savings, debts, and commitments.
      - Agreement on spending triggers and major financial goals.

      ### Chapter 3: Family & Cultural Integration
      - Aligning expectations between both extended families.
    `,
  },
  {
    id: "guide-2",
    title: "Navigating Intimacy & Communication in Marriage",
    slug: "navigating-intimacy-and-communication",
    excerpt: "Practical framework for maintaining deep emotional connection, effective conflict resolution, and lasting passion.",
    category: "Marriage",
    featuredImage: "/images/service-resources.jpg",
    publishedAt: "2026-06-18",
    featured: false,
    content: `
      ### Understanding Love Languages
      Learn how your spouse feels most cherished—words of affirmation, quality time, receiving gifts, acts of service, or physical touch.
    `,
  },
  {
    id: "guide-3",
    title: "De-escalating Arguments: A Guide to Healthy Conflict Resolution",
    slug: "de-escalating-arguments-healthy-conflict-resolution",
    excerpt: "Proven strategies for turning argument moments into opportunities for deeper connection and mutual understanding.",
    category: "Conflict Resolution",
    featuredImage: "/images/service-matchmaking.jpg",
    publishedAt: "2026-06-25",
    featured: false,
    content: `
      ### The 'Time-Out' Rule
      When emotional temperature rises above 7/10, request a 20-minute pause to calm down before continuing the conversation.
    `,
  },
  {
    id: "guide-4",
    title: "Diaspora Dating: Connecting Across Distance & Time Zones",
    slug: "diaspora-dating-connecting-across-distance",
    excerpt: "Essential guide for singles in the UK, USA, Canada, and Europe seeking compatible partners in Nigeria or abroad.",
    category: "Dating & Courtship",
    featuredImage: "/images/hero-couple.jpg",
    publishedAt: "2026-07-05",
    featured: false,
    content: `
      ### Setting Realistic Milestones
      Establish timelines for first physical meetings, introduction to family, and mutual relocation plans.
    `,
  },
  {
    id: "guide-5",
    title: "Spotting Red Flags Early in Intentional Courtship",
    slug: "spotting-red-flags-early-in-courtship",
    excerpt: "Learn how to distinguish between temporary behavioral flaws and major character incompatibility before making long-term commitments.",
    category: "Dating & Courtship",
    featuredImage: "/images/video-thumb-1.jpg",
    publishedAt: "2026-07-12",
    featured: false,
    content: `
      ### Top 5 Warning Signs:
      1. Secretiveness regarding background or employment.
      2. Explosive anger or silent treatment tactics.
      3. Disrespect toward parents or service staff.
      4. Avoidance of genotype or health disclosures.
      5. Financial dishonesty or repeated unexplained requests for money.
    `,
  },
];

// ─── 4. Success Stories ─────────────────────────────────────
export const demoSuccessStories: DemoSuccessStory[] = [
  {
    id: "story-1",
    title: "From Lagos to London: Tunde & Aminat's Journey",
    slug: "tunde-and-aminat-story",
    displayNames: "Tunde & Aminat A.",
    location: "Lagos & London",
    weddingDate: "December 2025",
    photoUrl: "/images/testimonials/tunde-aminat.jpg",
    featured: true,
    story: "After trying traditional dating apps without success, Tunde connected with Relationship Wahala & Connections. Through guided compatibility matching and pre-marital counseling, they built a strong foundation of trust despite the distance. Today they are happily married in London.",
  },
  {
    id: "story-2",
    title: "EPMS Matchmaking: Nkechi & Emeka",
    slug: "nkechi-and-emeka-story",
    displayNames: "Nkechi & Dr. Emeka O.",
    location: "Abuja, Nigeria",
    weddingDate: "August 2025",
    photoUrl: "/images/testimonials/nkechi-emeka.jpg",
    featured: true,
    story: "As busy executives in Abuja, Nkechi and Emeka had minimal time for casual dating. EPMS introduced them after thorough vetting. Their shared commitment to faith, family, and excellence resulted in an engagement within 8 months.",
  },
  {
    id: "story-3",
    title: "Love Restored & Rebuilt: David & Sarah",
    slug: "david-and-sarah-story",
    displayNames: "David & Sarah K.",
    location: "Lagos State",
    weddingDate: "April 2025",
    photoUrl: "/images/testimonials/david-sarah.jpg",
    featured: false,
    story: "David and Sarah used RWC's pre-marital counseling modules to overcome severe family communication barriers. The guided framework helped them align their priorities and plan a harmonious wedding and life together.",
  },
  {
    id: "story-4",
    title: "A Diaspora Connection: Funke & Femi",
    slug: "funke-and-femi-story",
    displayNames: "Funke & Femi M.",
    location: "Toronto & Lagos",
    weddingDate: "November 2025",
    photoUrl: "/images/testimonials/funke-femi.jpg",
    featured: false,
    story: "Living in Toronto while searching for a cultured Nigerian partner seemed challenging until RWC's Global Diaspora package brought Funke and Femi together. Their continuous communication and shared values made distance immaterial.",
  },
  {
    id: "story-5",
    title: "Traditional Values & Modern Love: Ibrahim & Zainab",
    slug: "ibrahim-and-zainab-story",
    displayNames: "Ibrahim & Zainab B.",
    location: "Kano, Nigeria",
    weddingDate: "January 2026",
    photoUrl: "/images/testimonials/ibrahim-zainab.jpg",
    featured: false,
    story: "With complete confidentiality and respect for cultural heritage, Ibrahim and Zainab were paired through EPMS. Their mutual respect and shared faith journey culminated in a beautiful celebration in Kano.",
  },
];

// ─── 5. Events ──────────────────────────────────────────────
export const demoEvents: DemoEvent[] = [
  {
    id: "event-1",
    title: "Annual Intentional Singles & Couples Masterclass 2026",
    slug: "annual-singles-couples-masterclass-2026",
    description: "Join Faruq and guest relationship experts for an intensive live masterclass on pre-marital readiness, financial alignment, and choosing the right life partner.",
    eventDate: "2026-08-15",
    eventTime: "10:00 AM - 3:00 PM WAT",
    location: "Eko Hotels & Suites, Victoria Island, Lagos & Zoom Virtual Stream",
    isOnline: false,
    registrationUrl: "/register",
    image: "/images/service-counseling.jpg",
  },
  {
    id: "event-2",
    title: "Global Diaspora Virtual Matchmaking Mixer",
    slug: "global-diaspora-virtual-matchmaking-mixer",
    description: "Exclusive, discreet virtual networking session connecting intentional African singles in the Diaspora (UK, US, Canada, Europe) with vetted singles in Nigeria.",
    eventDate: "2026-08-29",
    eventTime: "6:00 PM WAT / 1:00 PM EST / 6:00 PM BST",
    location: "Private Zoom Meeting (Pre-vetted registration required)",
    isOnline: true,
    registrationUrl: "/register",
    image: "/images/service-matchmaking.jpg",
  },
  {
    id: "event-3",
    title: "Pre-Marital Financial Clarity & Estate Planning Workshop",
    slug: "pre-marital-financial-clarity-workshop",
    description: "Expert-led workshop covering financial openness, pre-nuptial arrangements, joint budgeting, and building generational wealth as a married couple.",
    eventDate: "2026-09-12",
    eventTime: "11:00 AM - 2:00 PM WAT",
    location: "Virtual Webinar (Interactive Q&A)",
    isOnline: true,
    registrationUrl: "/contact",
    image: "/images/service-resources.jpg",
  },
];

// ─── 6. FAQs ────────────────────────────────────────────────
export const demoFAQs: DemoFAQ[] = [
  {
    id: "faq-1",
    question: "What makes Relationship Wahala & Connections different from dating apps?",
    answer: "Unlike standard dating apps that encourage superficial swiping, Relationship Wahala & Connections is a knowledge-first, vetted matchmaking platform focused on marriage. We verify identity, conduct background reviews, and match individuals based on core values, genotype compatibility, and long-term life goals.",
    category: "General",
    sortOrder: 1,
  },
  {
    id: "faq-2",
    question: "What is Executive Physical Matchmaking Service (EPMS)?",
    answer: "EPMS is our elite, highly confidential matchmaking service designed for corporate executives, business owners, professionals, and Diaspora singles who desire 1-on-1 personalized matchmaking, physical/virtual hosted date coordination, and dedicated relationship coaching.",
    category: "EPMS",
    sortOrder: 2,
  },
  {
    id: "faq-3",
    question: "Is my personal information and identity confidential?",
    answer: "Yes. Confidentiality is our highest priority. Your full profile and photos are never publicly exposed to search engines or non-vetted users. Profiles are shared only with compatible candidates after mutual interest is established.",
    category: "Privacy",
    sortOrder: 3,
  },
  {
    id: "faq-4",
    question: "How does the profile verification process work?",
    answer: "Upon registration, our verification team reviews your identity documents, contact numbers, singlehood status, and basic credentials. Verified profiles receive a verified badge, which increases match confidence across the platform.",
    category: "Account",
    sortOrder: 4,
  },
  {
    id: "faq-5",
    question: "What payment options are available for subscriptions?",
    answer: "We support instant online card payments via Paystack and Flutterwave, as well as Direct Bank Transfer. Bank transfers are manually reviewed and approved by our finance team within 24 hours.",
    category: "Payments",
    sortOrder: 5,
  },
  {
    id: "faq-6",
    question: "Can Diaspora singles in the UK, USA, or Canada join?",
    answer: "Absolutely! We have a dedicated Global Diaspora VIP package specifically designed to bridge the gap between singles living abroad and compatible partners in Nigeria or internationally.",
    category: "Matchmaking",
    sortOrder: 6,
  },
  {
    id: "faq-7",
    question: "Do you offer relationship and pre-marital counseling?",
    answer: "Yes, our certified relationship consultants provide 1-on-1 counseling sessions, pre-marital guidance, and conflict resolution workshops for both singles and engaged couples.",
    category: "General",
    sortOrder: 7,
  },
  {
    id: "faq-8",
    question: "How do I upgrade or manage my subscription?",
    answer: "You can view your active package, remaining match allowance, payment history, and upgrade options directly from your Customer Dashboard under the 'Subscription' tab.",
    category: "Payments",
    sortOrder: 8,
  },
  {
    id: "faq-9",
    question: "What happens after I express interest in a match?",
    answer: "When you click 'Interested', a notification is sent to the candidate or managed by your dedicated EPMS consultant. If the interest is mutual, contact coordinates or a facilitated date is arranged.",
    category: "Matchmaking",
    sortOrder: 9,
  },
  {
    id: "faq-10",
    question: "How can I contact customer support or schedule a private consultation?",
    answer: "You can submit an enquiry via our Contact page, email us directly at support@relationshipwahala.com, or call our customer line at +234 801 234 5678.",
    category: "General",
    sortOrder: 10,
  },
];

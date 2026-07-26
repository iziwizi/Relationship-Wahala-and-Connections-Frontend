// Video/podcast data — placeholder data structured for future YouTube API integration

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  thumbnailAlt: string;
  duration: string;
  views: string;
  publishedAgo: string;
  youtubeId?: string; // Future: real YouTube video ID
}

export const videos: VideoItem[] = [
  {
    id: "red-flags",
    title: "10 Red Flags You Should Never Ignore",
    thumbnail: "/images/video-thumb-1.jpg",
    thumbnailAlt: "Nigerian couple discussing relationship red flags",
    duration: "28:15",
    views: "1.2K Views",
    publishedAgo: "3 days ago",
    youtubeId: undefined,
  },
  {
    id: "preparing-for-marriage",
    title: "Preparing for Marriage: Are You Really Ready?",
    thumbnail: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=640&q=80",
    thumbnailAlt: "Couple preparing for marriage",
    duration: "32:40",
    views: "2.1K Views",
    publishedAgo: "1 week ago",
    youtubeId: undefined,
  },
  {
    id: "communication-secrets",
    title: "Communication Secrets Every Couple Needs",
    thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=640&q=80",
    thumbnailAlt: "Couple communicating openly",
    duration: "27:18",
    views: "1.8K Views",
    publishedAgo: "2 weeks ago",
    youtubeId: undefined,
  },
  {
    id: "money-marriage",
    title: "Money & Marriage: How to Manage Finances Together",
    thumbnail: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=640&q=80",
    thumbnailAlt: "Couple managing finances together",
    duration: "31:05",
    views: "2.5K Views",
    publishedAgo: "3 weeks ago",
    youtubeId: undefined,
  },
];

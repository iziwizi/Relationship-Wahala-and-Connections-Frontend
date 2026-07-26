import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import VideoCard from "@/components/sections/VideoCard";
import { getAllPodcastEpisodes } from "@/lib/repositories/podcast.repository";
import { Mic, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Video Podcast | Relationship Wahala TV",
  description:
    "Watch Relationship Wahala TV — raw, insightful, and expert-driven conversations on love, dating, marriage, conflict resolution, and marital success.",
};

function YoutubeIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-red-600" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default async function PodcastPage() {
  const episodes = await getAllPodcastEpisodes();

  const formattedVideos = episodes.map((ep) => ({
    id: ep.id,
    title: ep.title,
    youtubeUrl: ep.youtubeUrl,
    youtubeId: ep.youtubeVideoId,
    youtubeVideoId: ep.youtubeVideoId,
    thumbnail: ep.thumbnail,
    thumbnailAlt: ep.title,
    duration: ep.duration,
    description: ep.description,
    views: ep.views,
    publishedAgo: ep.publishedAt || "Recently",
  }));

  return (
    <>
      <Header />
      <main className="pt-20 bg-white">
        {/* Podcast Hero */}
        <section className="py-20 bg-[#7b1d2a] text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mic size={28} className="text-[#c9962c]" />
              </div>
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#c9962c] bg-white/10 px-3.5 py-1 rounded-full">
                RELATIONSHIP WAHALA TV
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6 leading-tight">
                Real Conversations. Real Solutions.
              </h1>
              <p className="font-sans text-white/80 text-base sm:text-lg leading-relaxed mb-8">
                Host raw, insightful, and expert-driven conversations about the complexities of love, dating, relationships, conflict resolution, and marital success.
              </p>
              <Button href="https://youtube.com" variant="gold" size="lg" external>
                Subscribe on YouTube <ArrowRight size={16} />
              </Button>
            </div>
          </Container>
        </section>

        {/* Video Grid */}
        <section className="py-16 bg-[#fbf5ec]">
          <Container>
            <div className="text-center mb-10">
              <SectionHeading eyebrow="EPISODES" heading="Latest Video Podcast Episodes" theme="dark" align="center" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {formattedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* Subscribe Box */}
            <div className="mt-12 bg-white rounded-2xl p-8 border border-[#e8e0d4] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <YoutubeIcon size={28} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">Never Miss an Episode</h3>
                  <p className="font-sans text-xs text-gray-500">Subscribe to our YouTube channel and turn on notifications for weekly releases.</p>
                </div>
              </div>
              <Button href="https://youtube.com" variant="primary" size="md" external className="whitespace-nowrap">
                Subscribe Now
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import ServicesSection from "@/components/sections/ServicesSection";
import EPMSSection from "@/components/sections/EPMSSection";
import PromotionalVideoPlayer from "@/components/sections/PromotionalVideoPlayer";
import PodcastSection from "@/components/sections/PodcastSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ServicesSection />
        <EPMSSection />
        <PromotionalVideoPlayer
          eyebrow="OFFICIAL PRESENTATION"
          title="Watch Our Official Feature Presentation"
          subtitle="Explore the vision, core values, and expert matchmaking process that make Relationship Wahala & Connections Nigeria's trusted platform for lasting marriages."
          className="bg-[#fbf5ec]"
        />
        <PodcastSection />
        <TestimonialsSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

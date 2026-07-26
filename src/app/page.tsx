import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import ServicesSection from "@/components/sections/ServicesSection";
import EPMSSection from "@/components/sections/EPMSSection";
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
        <PodcastSection />
        <TestimonialsSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

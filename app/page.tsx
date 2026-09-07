import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { CodeShowcase } from "@/components/CodeShowcase";
import { Features } from "@/components/Features";
import { WhySection } from "@/components/WhySection";
import { Community } from "@/components/Community";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CodeShowcase />
        <Features />
        <WhySection />
        <Community />
      </main>
      <Footer />
    </>
  );
}

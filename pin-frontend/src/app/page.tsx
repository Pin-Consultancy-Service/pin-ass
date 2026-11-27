import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ProgramsSection from "@/components/home/ProgramsSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import LearningJourneySection from "@/components/home/LearningJourneySection";
import TeamSection from "@/components/home/TeamSection";
import AchievementsSection from "@/components/home/AchievementsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import RegistrationSection from "@/components/home/RegistrationSection";
import CorporateSection from "@/components/home/CorporateSection";
import FAQSection from "@/components/home/FAQSection";
import ContactSection from "@/components/home/ContactSection";

export const metadata: Metadata = {
  title: "PIN Associates | ICAN/ACCA Tutoring · Business Consultancy · Corporate Training",
  description:
    "PIN Associates (Pass It Now) offers ICAN/ACCA professional exam tutoring, business and financial consultancy, and corporate training programmes across Nigeria. Expert practitioners. Proven results since 2009.",
};

export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <WhyChooseSection />
        <LearningJourneySection />
        <TeamSection />
        <AchievementsSection />
        <TestimonialsSection />
        <RegistrationSection />
        <CorporateSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

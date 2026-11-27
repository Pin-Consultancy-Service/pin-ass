import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutPageContent from "@/components/about/AboutPageContent";

export const metadata: Metadata = {
  title: "About PIN Associates | Our Story, Leadership & Mission",
  description:
    "Learn about PIN Associates — founded in 2009, Nigeria's trusted professional examination tutoring and business consultancy firm. Meet the management team behind our 87% pass rate.",
};

export default function AboutPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <main>
        <AboutPageContent />
      </main>
      <Footer />
    </div>
  );
}

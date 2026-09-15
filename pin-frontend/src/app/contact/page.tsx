import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactPageContent from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact PIN Associate | Get in Touch",
  description:
    "Contact PIN Associate for enquiries about professional examination tutoring, business consultancy, or corporate training. Our team responds within one business day.",
};

export default function ContactPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <main>
        <ContactPageContent />
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CorporatePageContent from "@/components/corporate/CorporatePageContent";

export const metadata: Metadata = {
  title: "Corporate Services | Business Consultancy & Corporate Training",
  description:
    "PIN Associate provides business and financial consultancy — advisory, taxation, financial statements, audits, and asset review — plus bespoke corporate training programmes for organisations across Nigeria.",
};

export default function CorporatePage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <main>
        <CorporatePageContent />
      </main>
      <Footer />
    </div>
  );
}

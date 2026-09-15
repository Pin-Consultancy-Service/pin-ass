import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PaymentPageContent from "@/components/payment/PaymentPageContent";

export const metadata: Metadata = {
  title: "Payment | Pay for Tutoring, Consultancy or Training",
  description:
    "Make secure online payments for PIN Associate's professional tutoring, business consultancy, or corporate training services. Pay via Paystack or bank transfer.",
};

export default function PaymentPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <main>
        <PaymentPageContent />
      </main>
      <Footer />
    </div>
  );
}

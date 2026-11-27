import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import NewsletterSection from "@/components/home/NewsletterSection";
import PageHero from "@/components/layout/PageHero";
import ProgrammesList from "@/components/courses/ProgrammesList";

export const metadata: Metadata = {
  title: "Programmes & Courses",
  description:
    "Browse PIN Consultancy Services' full range of professional examination programmes: ICAN, ACCA, CITN, ATS, CISA, Diploma in IFRS, Corporate Training and Business Consulting.",
};

const programmes = [
  {
    id: "ican",
    title: "ICAN",
    fullName: "Institute of Chartered Accountants of Nigeria",
    overview: "The gold standard of accountancy qualifications in Nigeria. Comprehensive tuition across Foundation, Skills, and Professional levels with experienced ICAN examiners.",
    duration: "12–36 months", mode: "In-person & Online",
    levels: ["Foundation", "Skills", "Professional"],
    badge: "Most Popular", badgeVariant: "gold" as const,
    href: "/courses/ican",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552599/ican-logo_tg9meu.jpg",
    outcomes: ["Chartered Accountant (ACA)", "ICAN Fellow (FCA)", "CFO & Finance Director roles"],
  },
  {
    id: "acca",
    title: "ACCA",
    fullName: "Association of Chartered Certified Accountants",
    overview: "A globally recognised accounting qualification accepted in over 180 countries. We prepare students for every level from Applied Knowledge to Strategic Professional.",
    duration: "18–48 months", mode: "In-person & Online",
    levels: ["Applied Knowledge", "Applied Skills", "Strategic Professional"],
    badge: "International", badgeVariant: "blue" as const,
    href: "/courses/acca",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552629/ACCA_logo.svg_osfbx1.webp",
    outcomes: ["ACCA Affiliate", "FCCA Member", "International Finance Careers"],
  },
  {
    id: "citn",
    title: "CITN",
    fullName: "Chartered Institute of Taxation of Nigeria",
    overview: "Specialised taxation qualification covering Nigerian tax law, planning, and compliance. Ideal for professionals seeking expertise in tax advisory and practice.",
    duration: "12–24 months", mode: "In-person & Online",
    levels: ["Qualifying", "Professional"],
    badge: "Tax Specialist", badgeVariant: "green" as const,
    href: "/courses/citn",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552741/CITN-logo_rqc5j5.jpg",
    outcomes: ["Associates Tax Member", "FCTI Fellow", "Tax Manager & Consultant roles"],
  },
  {
    id: "ats",
    title: "ATS",
    fullName: "Accounting Technicians Scheme West Africa",
    overview: "The foundational entry point into professional accounting. Perfect for OND holders, school leavers, and those building a career in finance and bookkeeping.",
    duration: "6–18 months", mode: "In-person & Online",
    levels: ["Foundation", "Intermediate", "Final"],
    badge: "Entry Level", badgeVariant: "gray" as const,
    href: "/courses/ats",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784553799/ATSWB-logo_pkmnpp.jpg",
    outcomes: ["Accounting Technician Certificate", "ICAN Exemptions", "Bookkeeping & Finance Roles"],
  },
  {
    id: "cisa",
    title: "CISA",
    fullName: "Certified Information Systems Auditor",
    overview: "ISACA's globally recognised qualification for IT audit, control, and security professionals. Highly valued by financial institutions, audit firms, and technology companies.",
    duration: "6–12 months", mode: "In-person & Online",
    levels: ["Single Examination"],
    badge: "IT Audit", badgeVariant: "blue" as const,
    href: "/courses/cisa",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552746/CISA-logo_emfhdi.png",
    outcomes: ["CISA Certification", "IT Audit Manager", "IS Governance Specialist"],
  },
  {
    id: "ifrs-diploma",
    title: "Diploma in IFRS",
    fullName: "International Financial Reporting Standards",
    overview: "ACCA-accredited diploma for accountants seeking expertise in IFRS application and financial reporting. Ideal for professionals in public interest entities and multinationals.",
    duration: "3–6 months", mode: "Weekends & Online",
    levels: ["Certificate", "Diploma"],
    badge: "ACCA Accredited", badgeVariant: "gold" as const,
    href: "/courses/ifrs-diploma",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552753/ifrs-logo_ellqno.svg",
    outcomes: ["Dip IFRS Qualification", "IFRS Reporting Expertise", "Multinational Finance Roles"],
  },
  {
    id: "corporate",
    title: "Corporate Training",
    fullName: "Tailored Workforce Development Programmes",
    overview: "Bespoke professional development for organisations. Training programmes are designed around your team's specific needs, regulatory environment, and learning objectives.",
    duration: "Flexible", mode: "On-site & Online",
    levels: ["Customised to your organisation"],
    badge: "For Organisations", badgeVariant: "gray" as const,
    href: "/corporate",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552599/ican-logo_tg9meu.jpg",
    outcomes: ["Qualified Finance Teams", "Regulatory Compliance", "Improved Organisational Performance"],
  },
  {
    id: "consulting",
    title: "Business Consulting",
    fullName: "Strategic Business & Financial Advisory",
    overview: "Expert business and financial advisory for SMEs and growing organisations. From financial modelling to tax planning, our consultants bring deep practical expertise.",
    duration: "Ongoing", mode: "Advisory",
    levels: ["Advisory Services"],
    badge: "Advisory", badgeVariant: "blue" as const,
    href: "/courses/consulting",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552599/ican-logo_tg9meu.jpg",
    outcomes: ["Improved Financial Performance", "Tax Efficiency", "Strategic Clarity"],
  },
];

export default function CoursesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}

          <PageHero
            label="Our Programmes"
            title="Professional Qualifications We Prepare You For"
            description="From accounting technician to chartered accountant, international to local
        qualifications — we offer structured tuition for every stage of your professional journey."
            slides={[
              { id: 1, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784484978/wmremove-transformed_1_1_el1lye.jpg", alt: "University students studying together" },
              { id: 2, src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=85", alt: "Professional accounting class" },
              { id: 3, src: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1600&q=85", alt: "Corporate learning session" },
            ]}
          />

        {/* Programmes list */}
        <section className="py-16 md:py-20" style={{ backgroundColor: "var(--bg)" }}>
          <div className="container-pin">
            <ProgrammesList programmes={programmes} />
          </div>
        </section>

        {/* Comparison CTA */}
        <section className="py-16" style={{ backgroundColor: "var(--surface)" }}>
          <div className="container-pin text-center">
            <SectionHeader
              label="Not sure which programme?"
              title="Let Us Help You Choose"
              description="Our admissions advisors will assess your background, career goals, and existing qualifications to recommend the right programme and entry point for you."
              align="center"
            />
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="btn btn-outline">
                Speak to an Advisor
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/apply" className="btn btn-primary">
                Apply Now
              </Link>
            </div>
          </div>
        </section>

        {/* <NewsletterSection /> */}
      </main>
      <Footer />
    </>
  );
}

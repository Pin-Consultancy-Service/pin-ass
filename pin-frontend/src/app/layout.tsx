import type { Metadata, Viewport } from "next";
import "./globals.css";
import GlobalWidgets from "@/components/layout/GlobalWidgets";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "var(--navy)",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://pinconsultancyservices.com"),
  title: {
    default: "PIN Consultancy Services | Professional ICAN, ACCA, CITN Exam Tutoring & Business Consultancy in Nigeria",
    template: "%s | PIN Consultancy Services",
  },
  description:
    "PIN Consultancy Services (PIN Associate) is Nigeria's leading professional exam preparation center. Expert tutoring for ICAN, ACCA, CITN, CISA, ATS, IFRS with 87% first-attempt pass rate. Business consultancy, tax advisory, and corporate training services across Nigeria. Founded 2009, 5,000+ graduates.",
  keywords: [
    "ICAN tuition Nigeria",
    "ACCA classes Nigeria",
    "CITN examination preparation",
    "ATS accountancy tutoring",
    "CISA training Nigeria",
    "IFRS diploma courses",
    "professional exam preparation Nigeria",
    "accounting tuition Lagos",
    "PIN Consultancy Services",
    "PIN Associate Nigeria",
    "Pass It Now Associates",
    "chartered accountant tutoring",
    "tax consultancy Nigeria",
    "business consultancy services",
    "corporate training Nigeria",
    "financial reporting consultancy",
    "ICAN exam coaching",
    "ACCA exam preparation",
    "accountancy exam tutors Nigeria",
    "professional qualification tutoring",
    "online accounting classes Nigeria",
    "weekend ICAN classes",
    "ACCA weekend classes Lagos",
    "taxation courses Nigeria",
    "audit training Nigeria",
    "financial modeling courses",
  ],
  authors: [{ name: "PIN Consultancy Services", url: "https://pinconsultancyservices.com" }],
  creator: "PIN Consultancy Services",
  publisher: "PIN Consultancy Services",
  alternates: {
    canonical: "https://pinconsultancyservices.com",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://pinconsultancyservices.com",
    siteName: "PIN Consultancy Services",
    title: "PIN Consultancy Services | #1 ICAN, ACCA, CITN Exam Tutoring in Nigeria",
    description:
      "Nigeria's most trusted professional exam preparation center since 2009. 5,000+ graduates, 87% first-attempt pass rate. Expert tutoring for ICAN, ACCA, CITN, CISA, ATS, IFRS. Business consultancy & corporate training.",
    images: [
      { 
        url: "https://pinconsultancyservices.com/og-image.jpg", 
        width: 1200, 
        height: 630, 
        alt: "PIN Consultancy Services - Professional Exam Tutoring Nigeria",
        type: "image/jpeg",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PIN Consultancy Services | Professional Exam Tutoring Nigeria",
    description: "5,000+ graduates. 87% pass rate. Expert ICAN, ACCA, CITN tutoring. Business consultancy & corporate training across Nigeria.",
    images: ["https://pinconsultancyservices.com/og-image.jpg"],
    creator: "@PINConsultancy",
    site: "@PINConsultancy",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: { 
      index: true, 
      follow: true, 
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "your-google-verification-code-here", // Add after Google Search Console setup
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "Education",
  classification: "Professional Training & Consultancy",
  icons: {
    icon: "/images/pin-logo.png",
    shortcut: "/images/pin-logo.png",
    apple: "/images/pin-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Structured Data for SEO (JSON-LD)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "PIN Consultancy Services",
    "alternateName": "PIN Associate",
    "url": "https://pinconsultancyservices.com",
    "logo": "https://pinconsultancyservices.com/images/pin-logo.png",
    "description": "Professional exam tutoring and business consultancy services. Expert coaching for ICAN, ACCA, CITN, CISA, ATS, and IFRS certification exams in Nigeria.",
    "foundingDate": "2009",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NG",
      "addressRegion": "Lagos",
      "addressLocality": "Lagos"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["English"],
      "areaServed": "NG"
    },
    "sameAs": [
      "https://www.linkedin.com/company/pin-consultancy-services",
      "https://twitter.com/PINConsultancy",
      "https://www.facebook.com/PINConsultancy"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Nigeria"
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Course",
          "name": "ICAN Professional Exam Tutoring",
          "description": "Comprehensive ICAN exam preparation across all levels",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "PIN Consultancy Services"
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Course",
          "name": "ACCA Professional Exam Tutoring",
          "description": "Expert ACCA exam coaching for all qualification levels",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "PIN Consultancy Services"
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Business & Financial Consultancy",
          "description": "Professional business consultancy, tax advisory, and financial reporting services",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "PIN Consultancy Services"
          }
        }
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "500",
      "bestRating": "5"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PIN Consultancy Services",
    "url": "https://pinconsultancyservices.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://pinconsultancyservices.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://pinconsultancyservices.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Courses",
        "item": "https://pinconsultancyservices.com/courses"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "About",
        "item": "https://pinconsultancyservices.com/about"
      }
    ]
  };

  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=Lexend:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        <style>{`
          :root {
            --font-lexend: 'Lexend', system-ui, sans-serif;
            --font-syne: 'Syne', system-ui, sans-serif;
          }
        `}</style>
        
        {/* Structured Data for Rich Search Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        
        {/* Additional meta tags for better SEO */}
        <meta name="geo.region" content="NG-LA" />
        <meta name="geo.placename" content="Lagos" />
        <meta name="geo.position" content="6.5244;3.3792" />
        <meta name="ICBM" content="6.5244, 3.3792" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <GlobalWidgets />
      </body>
    </html>
  );
}

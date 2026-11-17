import type { Metadata, Viewport } from "next";
import "./globals.css";
import GlobalWidgets from "@/components/layout/GlobalWidgets";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "var(--navy)",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://pinassociates.com.ng"),
  title: {
    default: "PIN Associate | Professional Exam Tutoring & Business Consultancy",
    template: "%s | PIN Associate",
  },
  description:
    "PIN Associate prepares students and professionals to pass ICAN, ACCA, CITN, CISA, ATS, and Diploma in IFRS exams on their first attempt. Expert tutors, flexible learning, proven results since 2009.",
  keywords: [
    "ICAN tuition Nigeria",
    "ACCA classes Nigeria",
    "CITN examination",
    "ATS accountancy",
    "CISA training",
    "IFRS diploma",
    "professional exam preparation",
    "accounting tuition",
    "PIN Associate",
    "Pass It Now Associates",
  ],
  authors: [{ name: "PIN Associate" }],
  creator: "PIN Associate",
  publisher: "PIN Associate",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://pinassociates.com.ng",
    siteName: "PIN Associate",
    title: "PIN Associate | Professional Exam Tutoring & Business Consultancy",
    description:
      "Expert professional exam tuition for ICAN, ACCA, CITN, CISA, ATS & more. Join thousands of successful professionals.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "PIN Associate" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PIN Associate",
    description: "Professional Exam Tutoring & Business Consultancy",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.jpg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <GlobalWidgets />
      </body>
    </html>
  );
}

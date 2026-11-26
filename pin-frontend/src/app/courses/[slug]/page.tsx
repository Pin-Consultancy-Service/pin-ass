import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { courses } from "@/lib/courseData";
import { CheckCircle2, Clock, Monitor, ArrowRight, BookOpen, Award, Users } from "lucide-react";
import NewsletterSection from "@/components/home/NewsletterSection";
import PageHero from "@/components/layout/PageHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(courses).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = courses[slug];
  if (!course) return { title: "Course Not Found" };
  return {
    title: `${course.title} — ${course.fullName}`,
    description: `PIN Consultancy Services provides expert tuition for ${course.title} (${course.fullName}). ${course.overview.slice(0, 150)}...`,
  };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = courses[slug];
  if (!course) notFound();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero — image slider */}
        <PageHero
          title={course.title}
          description={course.tagline}
          slides={[
            { id: 1, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784484978/wmremove-transformed_1_1_el1lye.jpg", alt: `${course.title} professional class` },
            { id: 2, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784481889/wmremove-transformed_3_ujyrty.jpg", alt: "Students studying" },
            { id: 3, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784613463/8_xzeshb.png", alt: "Professional examination preparation" },
          ]}
        >
          {/* Logo + badge + CTA row injected below the description */}
          <div className="flex flex-col items-center gap-6">

            {/* Programme logo */}
            {course.icon.startsWith("http") && (
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center p-2 border border-white/30">
                <img
                  src={course.icon}
                  alt={`${course.title} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/apply" className="btn btn-primary">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-outline-white">
                Speak to an Advisor
              </Link>
            </div>

            {/* Quick facts strip */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              {[
                { icon: Clock,    value: course.levels.map(l => l.duration).join(" + ") },
                { icon: Monitor,  value: course.mode.split(",")[0] },
                { icon: BookOpen, value: `${course.levels.length} Level${course.levels.length > 1 ? "s" : ""}` },
              ].map(({ icon: Icon, value }) => (
                <div
                  key={value}
                  className="flex items-center gap-2 bg-white/15 border border-white/30 backdrop-blur-sm
                             rounded-full px-4 py-2 text-white text-xs font-medium"
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />
                  {value}
                </div>
              ))}
            </div>
          </div>
        </PageHero>

        {/* Overview */}
        <section className="py-16 md:py-20" style={{ backgroundColor: "var(--bg)" }}>
          <div className="container-pin max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-2xl mb-5" style={{ color: "var(--ink)" }}>About This Programme</h2>
            <p className="text-base leading-relaxed mb-10" style={{ color: "var(--ink-light)" }}>{course.overview}</p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Who it's for */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5" style={{ color: "var(--navy)" }} />
                  <h3 className="font-heading font-bold text-base" style={{ color: "var(--ink)" }}>Who Is This For?</h3>
                </div>
                <ul className="space-y-3">
                  {course.who.map((w) => (
                    <li key={w} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A] mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed" style={{ color: "var(--ink-light)" }}>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcomes */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5" style={{ color: "var(--navy)" }} />
                  <h3 className="font-heading font-bold text-base" style={{ color: "var(--ink)" }}>Career Outcomes</h3>
                </div>
                <ul className="space-y-3">
                  {course.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "var(--gold)" }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--navy)" }} />
                      </div>
                      <span className="text-sm leading-relaxed" style={{ color: "var(--ink-light)" }}>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum */}
        <section className="py-16 md:py-20" style={{ backgroundColor: "var(--surface)" }}>
          <div className="container-pin max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-2xl mb-8" style={{ color: "var(--ink)" }}>Programme Structure</h2>
            <div className="space-y-5">
              {course.levels.map((level, i) => (
                <div 
                  key={level.name} 
                  className="rounded-2xl overflow-hidden shadow-sm" 
                  style={{ 
                    backgroundColor: "var(--bg)", 
                    border: "1px solid rgba(0, 0, 0, 0.06)"
                  }}
                >
                  <div 
                    className="flex items-center justify-between p-6" 
                    style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: "var(--navy)" }}>
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-base" style={{ color: "var(--ink)" }}>{level.name}</h3>
                        <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--ink-muted)" }}>
                          <Clock className="w-3 h-3" />
                          {level.duration}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ color: "var(--navy)", backgroundColor: "rgba(30, 64, 175, 0.08)" }}>
                      {level.papers.length} Paper{level.papers.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="p-6 grid sm:grid-cols-2 gap-3">
                    {level.papers.map((paper) => (
                      <div key={paper} className="flex items-start gap-2.5">
                        <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--ink-muted)" }} />
                        <span className="text-sm" style={{ color: "var(--ink-light)" }}>{paper}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        {course.faq.length > 0 && (
          <section className="py-16 md:py-20" style={{ backgroundColor: "var(--bg)" }}>
            <div className="container-pin max-w-3xl mx-auto">
              <h2 className="font-heading font-bold text-2xl mb-8" style={{ color: "var(--ink)" }}>
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {course.faq.map((item, i) => (
                  <div 
                    key={i} 
                    className="rounded-2xl p-6 shadow-sm" 
                    style={{ 
                      backgroundColor: "var(--surface)", 
                      border: "1px solid rgba(0, 0, 0, 0.06)"
                    }}
                  >
                    <h3 className="font-heading font-semibold text-base mb-2" style={{ color: "var(--ink)" }}>{item.q}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--ink-light)" }}>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA banner */}
        <section
          className="py-16"
          style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #152D6E 100%)" }}
        >
          <div className="container-pin text-center">
            <h2 className="font-heading font-bold text-3xl mb-4" style={{ color: "#FFFFFF" }}>
              Ready to Get Started?
            </h2>
            <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
              Apply now to secure your place in the upcoming diet or speak to one of our
              admissions advisors for personalised guidance.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/apply" className="btn btn-primary">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-outline-white">
                Contact an Advisor
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

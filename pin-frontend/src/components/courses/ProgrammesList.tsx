"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Monitor, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import ProgramIcon from "@/components/ui/ProgramIcon";
import { staggerContainer, staggerItem, viewportOptions } from "@/lib/animations";

interface Programme {
  id: string;
  title: string;
  fullName: string;
  overview: string;
  duration: string;
  mode: string;
  levels: string[];
  badge: string;
  badgeVariant: "gold" | "blue" | "green" | "gray";
  href: string;
  icon: string;
  outcomes: string[];
}

interface ProgrammesListProps {
  programmes: Programme[];
}

export default function ProgrammesList({ programmes }: ProgrammesListProps) {
  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOptions}
    >
      {programmes.map((prog) => (
        <motion.div
          key={prog.id}
          variants={staggerItem}
          className="group rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300"
          style={{ 
            backgroundColor: "var(--bg)",
            border: "1px solid rgba(0, 0, 0, 0.06)"
          }}
        >
          <div className="grid md:grid-cols-[auto_1fr_auto] gap-6 p-7 items-start">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden p-1" style={{ backgroundColor: "var(--bg)", border: "1px solid rgba(0, 0, 0, 0.06)" }}>
              <ProgramIcon icon={prog.icon} title={prog.title} />
            </div>

            {/* Main content */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h2 className="font-heading font-bold text-xl" style={{ color: "var(--navy)" }}>{prog.title}</h2>
                <Badge variant={prog.badgeVariant} size="sm">{prog.badge}</Badge>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--ink-muted)" }}>{prog.fullName}</p>
              <p className="text-sm leading-relaxed mb-4 max-w-2xl" style={{ color: "var(--ink-light)" }}>{prog.overview}</p>

              <div className="flex flex-wrap gap-4 text-xs mb-4" style={{ color: "var(--ink-muted)" }}>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" style={{ color: "var(--ink-muted)" }} />
                  {prog.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5" style={{ color: "var(--ink-muted)" }} />
                  {prog.mode}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" style={{ color: "var(--ink-muted)" }} />
                  {prog.levels.join(" · ")}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {prog.outcomes.map((o) => (
                  <span key={o} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ color: "#15803D", backgroundColor: "#DCFCE7" }}>
                    <CheckCircle2 className="w-3 h-3" />
                    {o}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link href={prog.href} className="btn btn-primary">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/apply" className="btn btn-outline">
                Apply Now
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

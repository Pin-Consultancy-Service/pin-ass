"use client";

import { motion } from "framer-motion";
import { fadeSlideUp, staggerContainer, staggerItem, viewportOptions } from "@/lib/animations";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: "fadeSlideUp" | "staggerContainer";
}

export function AnimatedSection({ children, className, style, variant = "fadeSlideUp" }: AnimatedSectionProps) {
  const variants = variant === "staggerContainer" ? staggerContainer : fadeSlideUp;
  
  return (
    <motion.section
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOptions}
      variants={variants}
    >
      {children}
    </motion.section>
  );
}

interface AnimatedDivProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: "fadeSlideUp" | "staggerItem";
}

export function AnimatedDiv({ children, className, style, variant = "fadeSlideUp" }: AnimatedDivProps) {
  const variants = variant === "staggerItem" ? staggerItem : fadeSlideUp;
  
  return (
    <motion.div
      className={className}
      style={style}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

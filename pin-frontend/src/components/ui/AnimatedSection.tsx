"use client";

import { motion } from "framer-motion";
import { fadeSlideUp, staggerContainer, staggerItem, viewportOptions as defaultViewportOptions } from "@/lib/animations";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: "fadeSlideUp" | "staggerContainer";
  viewport?: { once?: boolean; margin?: string; amount?: number | "some" | "all" };
}

export function AnimatedSection({ children, className, style, variant = "fadeSlideUp", viewport }: AnimatedSectionProps) {
  const variants = variant === "staggerContainer" ? staggerContainer : fadeSlideUp;
  
  return (
    <motion.section
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={viewport ?? defaultViewportOptions}
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

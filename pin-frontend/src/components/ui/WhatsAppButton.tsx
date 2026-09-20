"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  // Hide widget on certain paths
  const isHidden = SITE_CONFIG.hiddenWidgetPaths.some((p) =>
    pathname.startsWith(p)
  );

  useEffect(() => {
    if (isHidden || tooltipDismissed) return;

    // IntersectionObserver to watch Hero and Footer sections
    const observer = new IntersectionObserver(
      (entries) => {
        const heroEntry = entries.find(entry => entry.target.id === 'hero');
        const footerEntry = entries.find(entry => entry.target.id === 'footer');
        
        // Show tooltip when Hero OR Footer is in view
        const shouldShow = (heroEntry?.isIntersecting) || (footerEntry?.isIntersecting);
        setShowTooltip(shouldShow);
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -10% 0px' // Slightly reduce the trigger area
      }
    );

    // Start observing Hero and Footer sections
    const heroElement = document.getElementById('hero');
    const footerElement = document.getElementById('footer');
    
    if (heroElement) observer.observe(heroElement);
    if (footerElement) observer.observe(footerElement);

    return () => observer.disconnect();
  }, [isHidden, tooltipDismissed]);

  const handleDismissTooltip = () => {
    setTooltipDismissed(true);
    setShowTooltip(false);
  };

  if (isHidden) return null;

  return (
    <div className="fixed z-50" style={{ right: "1.25rem", bottom: "1.25rem" }}>
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !tooltipDismissed && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: 5 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 10, y: 5 }}
            transition={{ 
              type: "tween",
              ease: [0.4, 0, 0.2, 1],
              duration: 0.3
            }}
            className="absolute right-16 bottom-2 flex items-center"
            style={{
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            {/* Speech bubble */}
            <div
              className="relative flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-lg"
              style={{
                maxWidth: "200px",
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))"
              }}
            >
              Chat with our team
              
              {/* Dismiss button */}
              <button
                onClick={handleDismissTooltip}
                className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Dismiss tooltip"
                style={{
                  width: "16px",
                  height: "16px",
                  padding: 0,
                  border: "none",
                  background: "none",
                  cursor: "pointer"
                }}
              >
                <X size={14} />
              </button>

              {/* Pointer tail */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -right-1"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  borderLeft: "8px solid white"
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button - unchanged functionality */}
      <motion.a
        href={SITE_CONFIG.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with PIN Associate on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.2 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="flex items-center justify-center focus-visible:outline-none"
        style={{
          width: "3.25rem",
          height: "3.25rem",
          backgroundColor: "#25D366",
          color: "#fff",
          borderRadius: "50%",
          boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          style={{ width: "1.625rem", height: "1.625rem", fill: "currentColor" }}
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.12 1.523 5.851L.063 23.75l6.093-1.437A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.213-3.617.853.895-3.508-.233-.37A9.793 9.793 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z" />
        </svg>

        {/* Subtle pulse ring */}
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: "#25D366", opacity: 0.2 }}
          aria-hidden="true"
        />
      </motion.a>
    </div>
  );
}

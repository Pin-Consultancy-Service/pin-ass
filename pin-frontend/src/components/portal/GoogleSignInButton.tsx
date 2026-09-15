"use client";

import { useEffect, useRef, useState } from "react";

/**
 * GoogleSignInButton
 * ------------------
 * Renders a Google Identity Services "Sign in with Google" button.
 *
 * Props:
 *   onCredential  Called with the raw Google ID token once the user
 *                 completes the Google sign-in flow. Pass it straight
 *                 to googleAuth() from lib/auth.ts.
 *   label         Button label (default: "Continue with Google")
 *   disabled      Disable the button while a parent action is in progress
 *
 * Requirements:
 *   NEXT_PUBLIC_GOOGLE_CLIENT_ID must be set in pin-frontend/.env.local
 *   (See SYSTEM.md — Google OAuth Setup section)
 *
 * If NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing the button shows a "not
 * configured" notice instead of breaking the page.
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: {
            client_id: string;
            callback: (resp: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            el: HTMLElement,
            opts: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              shape?: "rectangular" | "pill" | "circle" | "square";
              width?: number;
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              logo_alignment?: "left" | "center";
            }
          ) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void;
  label?: string;
  disabled?: boolean;
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export default function GoogleSignInButton({
  onCredential,
  label = "Continue with Google",
  disabled = false,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady]       = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) {
      setNotConfigured(true);
      return;
    }

    // Load Google Identity Services script once
    const existing = document.getElementById("google-gsi-script");
    if (existing) {
      initGoogle();
      return;
    }

    const script = document.createElement("script");
    script.id  = "google-gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => initGoogle();
    document.head.appendChild(script);

    return () => {
      window.google?.accounts.id.disableAutoSelect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function initGoogle() {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => {
        if (response.credential) {
          onCredential(response.credential);
        }
      },
      cancel_on_tap_outside: true,
    });
    if (containerRef.current) {
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: "outline",
        size:  "large",
        shape: "rectangular",
        width: containerRef.current.offsetWidth || 400,
        text:  "continue_with",
        logo_alignment: "center",
      });
    }
    setReady(true);
  }

  if (notConfigured) {
    return (
      <div className="w-full p-3 rounded-xl border border-[var(--rule)] bg-[var(--surface)] text-center">
        <p className="text-xs text-[var(--ink-faint)]">
          Google sign-in is not configured.{" "}
          <span className="font-semibold">
            Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local to enable it.
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full transition-opacity ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Google renders its own styled button into this container */}
      <div ref={containerRef} className="w-full" style={{ minHeight: 44 }} />
      {/* Fallback text while script loads */}
      {!ready && (
        <div className="w-full h-11 bg-[var(--surface)] border border-[var(--rule)] rounded-lg
                        flex items-center justify-center gap-3 animate-pulse">
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-sm text-[var(--ink-muted)]">Loading Google sign-in…</span>
        </div>
      )}
    </div>
  );
}

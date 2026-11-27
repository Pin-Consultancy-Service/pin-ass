import LoginPageContent from "@/components/portal/LoginPageContent";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Portal Login | PIN Associates",
  description: "Sign in to your PIN Associates student, client, or training portal.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}

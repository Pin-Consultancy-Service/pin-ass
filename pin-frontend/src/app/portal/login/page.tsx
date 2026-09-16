import LoginPageContent from "@/components/portal/LoginPageContent";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Portal Login | PIN Associate",
  description: "Sign in to your PIN Associate student, client, or training portal.",
};

export default function LoginPage() {
  return <LoginPageContent />;
}

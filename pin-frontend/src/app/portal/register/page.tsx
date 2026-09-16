import RegisterPageContent from "@/components/portal/RegisterPageContent";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Create an Account | PIN Associate",
  description: "Register for access to the PIN Associate student or client portal.",
};

export default function RegisterPage() {
  return <RegisterPageContent />;
}

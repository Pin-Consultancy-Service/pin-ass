import RegisterPageContent from "@/components/portal/RegisterPageContent";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Create an Account | PIN Associates",
  description: "Register for access to the PIN Associates student or client portal.",
};

export default function RegisterPage() {
  return <RegisterPageContent />;
}

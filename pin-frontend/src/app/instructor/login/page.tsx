import InstructorLoginContent from "@/components/instructor/InstructorLoginContent";
import type { Metadata } from "next";

export const metadata: Metadata = { 
  title: "Instructor Login | PIN Associate",
  description: "Login to the PIN Associate Instructor Portal"
};

export default function InstructorLoginPage() { 
  return <InstructorLoginContent />; 
}

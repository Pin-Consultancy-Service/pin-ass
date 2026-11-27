import InstructorLoginContent from "@/components/instructor/InstructorLoginContent";
import type { Metadata } from "next";

export const metadata: Metadata = { 
  title: "Instructor Login | PIN Associates",
  description: "Login to the PIN Associates Instructor Portal"
};

export default function InstructorLoginPage() { 
  return <InstructorLoginContent />; 
}

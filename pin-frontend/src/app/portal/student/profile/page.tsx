import type { Metadata } from "next";
import StudentProfilePage from "@/components/portal/student/StudentProfilePage";

export const metadata: Metadata = { title: "My Profile | Student Portal" };

export default function Page() {
  return <StudentProfilePage />;
}

import type { Metadata } from "next";
import StudentFeesPage from "@/components/portal/student/StudentFeesPage";

export const metadata: Metadata = { title: "Fees & Payments | Student Portal" };

export default function Page() {
  return <StudentFeesPage />;
}

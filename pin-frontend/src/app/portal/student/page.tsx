import type { Metadata } from "next";
import StudentDashboard from "@/components/portal/student/StudentDashboard";

export const metadata: Metadata = { title: "Student Dashboard | PIN Associate Portal" };

export default function StudentDashboardPage() {
  return <StudentDashboard />;
}

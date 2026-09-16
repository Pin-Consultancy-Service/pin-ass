import type { Metadata } from "next";
import DashboardLayout from "@/components/portal/DashboardLayout";
import StudentDashboardContent from "@/components/portal/student/StudentDashboardContent";

export const metadata: Metadata = { title: "Student Dashboard | PIN Associate Portal" };

export default function StudentDashboardPage() {
  return (
    <DashboardLayout activeTab="dashboard">
      <StudentDashboardContent />
    </DashboardLayout>
  );
}

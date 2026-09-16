import type { Metadata } from "next";
import DashboardLayout from "@/components/portal/DashboardLayout";
import StudentClassesContent from "@/components/portal/student/StudentClassesContent";

export const metadata: Metadata = { title: "Classes | Student Portal" };

export default function ClassesPage() {
  return (
    <DashboardLayout activeTab="classes">
      <StudentClassesContent />
    </DashboardLayout>
  );
}
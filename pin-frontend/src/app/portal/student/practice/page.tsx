import type { Metadata } from "next";
import DashboardLayout from "@/components/portal/DashboardLayout";
import StudentPracticeContent from "@/components/portal/student/StudentPracticeContent";

export const metadata: Metadata = { title: "Past Questions | Student Portal" };

export default function PracticePage() {
  return (
    <DashboardLayout activeTab="practice">
      <StudentPracticeContent />
    </DashboardLayout>
  );
}
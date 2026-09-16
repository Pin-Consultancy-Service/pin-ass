import type { Metadata } from "next";
import DashboardLayout from "@/components/portal/DashboardLayout";
import StudentAssignmentsContent from "@/components/portal/student/StudentAssignmentsContent";


export const metadata: Metadata = { title: "Assignments | Student Portal" };

export default function AssignmentsPage() {
  return (
    <DashboardLayout activeTab="assignments">
      <StudentAssignmentsContent />
    </DashboardLayout>
  );
}
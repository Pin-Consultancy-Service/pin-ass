import InstructorDashboardLayout from "@/components/instructor/InstructorDashboardLayout";
import InstructorStudentsContent from "@/components/instructor/InstructorStudentsContent";

export default function InstructorStudentsPage() {
  return (
    <InstructorDashboardLayout activeTab="students">
      <InstructorStudentsContent />
    </InstructorDashboardLayout>
  );
}

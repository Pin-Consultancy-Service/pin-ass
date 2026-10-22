import InstructorDashboardLayout from "@/components/instructor/InstructorDashboardLayout";
import InstructorClassesContent from "@/components/instructor/InstructorClassesContent";

export default function InstructorClassesPage() {
  return (
    <InstructorDashboardLayout activeTab="classes">
      <InstructorClassesContent />
    </InstructorDashboardLayout>
  );
}

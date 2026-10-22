import InstructorDashboardLayout from "@/components/instructor/InstructorDashboardLayout";
import InstructorDashboardContent from "@/components/instructor/InstructorDashboardContent";

export default function InstructorDashboardPage() {
  return (
    <InstructorDashboardLayout activeTab="dashboard">
      <InstructorDashboardContent />
    </InstructorDashboardLayout>
  );
}

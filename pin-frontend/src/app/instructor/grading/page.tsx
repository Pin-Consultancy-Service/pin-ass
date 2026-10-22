import InstructorDashboardLayout from "@/components/instructor/InstructorDashboardLayout";
import InstructorGradingContent from "@/components/instructor/InstructorGradingContent";

export default function InstructorGradingPage() {
  return (
    <InstructorDashboardLayout activeTab="grading">
      <InstructorGradingContent />
    </InstructorDashboardLayout>
  );
}

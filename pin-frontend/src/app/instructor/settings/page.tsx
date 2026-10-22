import InstructorDashboardLayout from "@/components/instructor/InstructorDashboardLayout";
import InstructorSettingsContent from "@/components/instructor/InstructorSettingsContent";

export default function InstructorSettingsPage() {
  return (
    <InstructorDashboardLayout activeTab="settings">
      <InstructorSettingsContent />
    </InstructorDashboardLayout>
  );
}

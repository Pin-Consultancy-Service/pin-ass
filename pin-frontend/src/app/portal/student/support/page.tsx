import DashboardLayout from "@/components/portal/DashboardLayout";
import StudentSupportContent from "@/components/portal/student/StudentSupportContent";

export default function StudentSupportPage() {
  return (
    <DashboardLayout activeTab="support">
      <StudentSupportContent />
    </DashboardLayout>
  );
}

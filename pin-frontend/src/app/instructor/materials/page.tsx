import InstructorDashboardLayout from "@/components/instructor/InstructorDashboardLayout";
import InstructorMaterialsContent from "@/components/instructor/InstructorMaterialsContent";

export default function InstructorMaterialsPage() {
  return (
    <InstructorDashboardLayout activeTab="materials">
      <InstructorMaterialsContent />
    </InstructorDashboardLayout>
  );
}

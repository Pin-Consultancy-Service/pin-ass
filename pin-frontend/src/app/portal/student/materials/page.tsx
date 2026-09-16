import type { Metadata } from "next";
import DashboardLayout from "@/components/portal/DashboardLayout";
import StudentMaterialsPage from "@/components/portal/student/StudentMaterialsPage";

export const metadata: Metadata = { title: "Study Materials | Student Portal" };

export default function Page() {
  return (
    <DashboardLayout activeTab="resources">
      <StudentMaterialsPage />
    </DashboardLayout>
  );
}

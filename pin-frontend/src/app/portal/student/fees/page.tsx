import type { Metadata } from "next";
import DashboardLayout from "@/components/portal/DashboardLayout";
import StudentFeesPageEnhanced from "@/components/portal/student/StudentFeesPageEnhanced";

export const metadata: Metadata = { title: "Fees & Payments | Student Portal" };

export default function Page() {
  return (
    <DashboardLayout activeTab="finances">
      <StudentFeesPageEnhanced />
    </DashboardLayout>
  );
}

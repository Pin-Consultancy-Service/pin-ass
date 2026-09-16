import type { Metadata } from "next";
import DashboardLayout from "@/components/portal/DashboardLayout";
import StudentProfilePage from "@/components/portal/student/StudentProfilePage";


export const metadata: Metadata = { title: "My Profile | Student Portal" };

export default function Page() {
  return (
    <DashboardLayout activeTab="profile">
      <StudentProfilePage />
    </DashboardLayout>
  );
}

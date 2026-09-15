import type { Metadata } from "next";
import StudentMaterialsPage from "@/components/portal/student/StudentMaterialsPage";

export const metadata: Metadata = { title: "Study Materials | Student Portal" };

export default function Page() {
  return <StudentMaterialsPage />;
}

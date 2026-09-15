import type { Metadata } from "next";
import AdminPortalContent from "@/components/portal/admin/AdminPortalContent";

export const metadata: Metadata = {
  title: "Staff Admin | PIN Associate — Internal Tool",
  robots: { index: false, follow: false },
};

export default function AdminPortalPage() {
  return <AdminPortalContent />;
}

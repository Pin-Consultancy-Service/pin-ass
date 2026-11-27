import type { Metadata } from "next";
import AdminPortalContent from "@/components/portal/admin/AdminPortalContent";

export const metadata: Metadata = {
  title: "Staff Admin | PIN Associates — Internal Tool",
  robots: { index: false, follow: false },
};

export default function AdminPortalPage() {
  return <AdminPortalContent />;
}

import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";
import AdminCommunicationsContent from "@/components/admin/AdminCommunicationsContent";

export default function AdminCommunicationsPage() {
  return (
    <AdminDashboardLayout activeTab="communications">
      <AdminCommunicationsContent />
    </AdminDashboardLayout>
  );
}

import { Metadata } from 'next';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import AdminDashboardContent from '@/components/admin/AdminDashboardContent';

export const metadata: Metadata = { 
  title: 'Dashboard | Admin Portal' 
};

export default function AdminDashboardPage() {
  return (
    <AdminDashboardLayout activeTab="dashboard">
      <AdminDashboardContent />
    </AdminDashboardLayout>
  );
}

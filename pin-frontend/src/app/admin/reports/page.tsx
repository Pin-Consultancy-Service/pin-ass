import { Metadata } from 'next';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import AdminReportsContent from '@/components/admin/AdminReportsContent';

export const metadata: Metadata = { 
  title: 'Reports | Admin Portal' 
};

export default function AdminReportsPage() {
  return (
    <AdminDashboardLayout activeTab="reports">
      <AdminReportsContent />
    </AdminDashboardLayout>
  );
}

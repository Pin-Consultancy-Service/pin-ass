import { Metadata } from 'next';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import AdminOperationsOverview from '@/components/admin/AdminOperationsOverview';

export const metadata: Metadata = { 
  title: 'Dashboard | Admin Portal' 
};

export default function AdminDashboardPage() {
  return (
    <AdminDashboardLayout activeTab="dashboard">
      <AdminOperationsOverview />
    </AdminDashboardLayout>
  );
}

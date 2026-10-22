import { Metadata } from 'next';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import AdminUsersContent from '@/components/admin/AdminUsersContent';

export const metadata: Metadata = { 
  title: 'Users | Admin Portal' 
};

export default function AdminUsersPage() {
  return (
    <AdminDashboardLayout activeTab="users">
      <AdminUsersContent />
    </AdminDashboardLayout>
  );
}

import { Metadata } from 'next';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import AdminStudentsContent from '@/components/admin/AdminStudentsContent';

export const metadata: Metadata = { 
  title: 'Students | Admin Portal' 
};

export default function AdminStudentsPage() {
  return (
    <AdminDashboardLayout activeTab="students">
      <AdminStudentsContent />
    </AdminDashboardLayout>
  );
}

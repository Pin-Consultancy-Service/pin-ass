import { Metadata } from 'next';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import AdminInstructorsContent from '@/components/admin/AdminInstructorsContent';

export const metadata: Metadata = { 
  title: 'Instructors | Admin Portal' 
};

export default function AdminInstructorsPage() {
  return (
    <AdminDashboardLayout activeTab="instructors">
      <AdminInstructorsContent />
    </AdminDashboardLayout>
  );
}

import { Metadata } from 'next';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import AdminEnrollmentsContent from '@/components/admin/AdminEnrollmentsContent';

export const metadata: Metadata = { 
  title: 'Enrollments | Admin Portal' 
};

export default function AdminEnrollmentsPage() {
  return (
    <AdminDashboardLayout activeTab="enrollments">
      <AdminEnrollmentsContent />
    </AdminDashboardLayout>
  );
}

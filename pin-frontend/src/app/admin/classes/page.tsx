import { Metadata } from 'next';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import AdminClassesContent from '@/components/admin/AdminClassesContent';

export const metadata: Metadata = { 
  title: 'Classes | Admin Portal' 
};

export default function AdminClassesPage() {
  return (
    <AdminDashboardLayout activeTab="classes">
      <AdminClassesContent />
    </AdminDashboardLayout>
  );
}

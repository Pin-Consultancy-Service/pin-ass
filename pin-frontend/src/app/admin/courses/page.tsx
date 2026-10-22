import { Metadata } from 'next';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import AdminCoursesContent from '@/components/admin/AdminCoursesContent';

export const metadata: Metadata = { 
  title: 'Courses | Admin Portal' 
};

export default function AdminCoursesPage() {
  return (
    <AdminDashboardLayout activeTab="courses">
      <AdminCoursesContent />
    </AdminDashboardLayout>
  );
}

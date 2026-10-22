import { Metadata } from 'next';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import AdminSettingsContent from '@/components/admin/AdminSettingsContent';

export const metadata: Metadata = { 
  title: 'Settings | Admin Portal' 
};

export default function AdminSettingsPage() {
  return (
    <AdminDashboardLayout activeTab="settings">
      <AdminSettingsContent />
    </AdminDashboardLayout>
  );
}

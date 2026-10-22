import { Metadata } from 'next';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import AdminFinancesContent from '@/components/admin/AdminFinancesContent';

export const metadata: Metadata = { 
  title: 'Finances | Admin Portal' 
};

export default function AdminFinancesPage() {
  return (
    <AdminDashboardLayout activeTab="finances">
      <AdminFinancesContent />
    </AdminDashboardLayout>
  );
}

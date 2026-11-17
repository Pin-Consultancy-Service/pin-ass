import { Metadata } from 'next';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import AdminOperationsOverview from '@/components/admin/AdminOperationsOverview';

export const metadata: Metadata = { 
  title: 'Finances | Admin Portal' 
};

export default function AdminFinancesPage() {
  return (
    <AdminDashboardLayout activeTab="finances">
      <AdminOperationsOverview />
    </AdminDashboardLayout>
  );
}

import { Metadata } from 'next';
import AdminLoginContent from '@/components/admin/AdminLoginContent';

export const metadata: Metadata = { 
  title: 'Admin Login | PIN Associates' 
};

export default function AdminLoginPage() {
  return <AdminLoginContent />;
}

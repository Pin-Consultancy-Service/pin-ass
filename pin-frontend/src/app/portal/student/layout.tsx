import StudentPortalLayout from "@/components/portal/StudentPortalLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <StudentPortalLayout>{children}</StudentPortalLayout>;
}

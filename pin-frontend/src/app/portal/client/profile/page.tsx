import type { Metadata } from "next";
import ClientProfilePage from "@/components/portal/client/ClientProfilePage";
export const metadata: Metadata = { title: "My Profile | Client Portal" };
export default function Page() { return <ClientProfilePage />; }

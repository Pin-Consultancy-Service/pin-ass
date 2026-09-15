import type { Metadata } from "next";
import ClientDashboard from "@/components/portal/client/ClientDashboard";

export const metadata: Metadata = { title: "Client Dashboard | PIN Associate Portal" };
export default function Page() { return <ClientDashboard />; }

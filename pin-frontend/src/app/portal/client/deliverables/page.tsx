import type { Metadata } from "next";
import ClientDeliverablesPage from "@/components/portal/client/ClientDeliverablesPage";
export const metadata: Metadata = { title: "Deliverables | Client Portal" };
export default function Page() { return <ClientDeliverablesPage />; }

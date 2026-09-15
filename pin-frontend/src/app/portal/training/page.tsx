import type { Metadata } from "next";
import TrainingDashboard from "@/components/portal/training/TrainingDashboard";
export const metadata: Metadata = { title: "Training Dashboard | PIN Associate Portal" };
export default function Page() { return <TrainingDashboard />; }

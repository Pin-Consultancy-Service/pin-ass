import type { Metadata } from "next";
import TrainingProfilePage from "@/components/portal/training/TrainingProfilePage";
export const metadata: Metadata = { title: "My Profile | Training Portal" };
export default function Page() { return <TrainingProfilePage />; }

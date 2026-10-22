import type { Metadata } from "next";
import PracticeExamInterface from "@/components/portal/student/PracticeExamInterface";

export const metadata: Metadata = { title: "Practice Exam | Student Portal" };

export default function PracticeExamPage({ params }: { params: { examId: string } }) {
  return <PracticeExamInterface examId={params.examId} />;
}

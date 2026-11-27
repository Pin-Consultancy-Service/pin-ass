/**
 * Achievements & awards data.
 * All entries are [PLACEHOLDER] until PIN Associate supplies final copy and images.
 * Replace `image` with Cloudinary URLs and update `title`/`description` as directed.
 */
export interface Achievement {
  id: string;
  year: string;
  title: string;
  body: string;
  image?: string; // Cloudinary URL
  category: "award" | "milestone" | "recognition";
}

export const achievements: Achievement[] = [
  {
    id: "ican-excellence-2024",
    year: "2024",
    title: "ICAN Excellence Award", // [PLACEHOLDER — confirm award name]
    body: "Recognised by the Institute of Chartered Accountants of Nigeria for outstanding contributions to professional examination tuition and student outcomes.", // [PLACEHOLDER]
    image: undefined, // [PLACEHOLDER — award photo/certificate to be supplied]
    category: "award",
  },
  {
    id: "5000-graduates",
    year: "2023",
    title: "5,000 Graduates Milestone",
    body: "PIN Associates celebrated the graduation of its 5,000th student a testament to 14 years of consistent, exam-focused professional training across Nigeria.",
    image: undefined, // [PLACEHOLDER]
    category: "milestone",
  },
  {
    id: "top-tuition-provider",
    year: "2022",
    title: "Top Professional Tuition Provider", // [PLACEHOLDER]
    body: "Named among Nigeria's leading professional examination tuition providers by ICAN, recognising our 87% first-attempt pass rate.", // [PLACEHOLDER]
    image: undefined, // [PLACEHOLDER]
    category: "recognition",
  },
  {
    id: "corporate-training-award",
    year: "2021",
    title: "Corporate Training Excellence", // [PLACEHOLDER]
    body: "Honoured for delivering measurable workforce development outcomes across 50+ organisations, including FMCG, banking, and public-sector clients.", // [PLACEHOLDER]
    image: undefined, // [PLACEHOLDER]
    category: "award",
  },
];

export const milestoneStats = [
  { value: "5,000+", label: "Professionals Trained" },
  { value: "87%",    label: "First-Attempt Pass Rate" },
  { value: "50+",    label: "Organisations Served" },
  { value: "16+",    label: "Years of Practice" },
];

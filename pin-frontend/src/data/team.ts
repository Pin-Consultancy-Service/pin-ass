/**
 * Management team data.
 * Photos are [PLACEHOLDER] until supplied by PIN Associate.
 * Replace the `image` values with Cloudinary URLs when available.
 */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  quals: string;
  bio: string;
  initials: string;
  color: string;
  image?: string; // Cloudinary URL — leave undefined until supplied
}

export const teamMembers: TeamMember[] = [
  {
    id: "olalekan-olorunsogo",
    name: "Olalekan Olorunsogo",
    role: "Founder & Managing Director",
    quals: "ACA, ACCA", // [PLACEHOLDER — confirm full credentials]
    bio: "Olalekan founded PIN Associate with a single conviction: that every determined professional deserves a clear, structured path to qualification. With over 16 years building Nigeria's exam-prep landscape, he has personally overseen the training of more than 5,000 chartered accountants and finance professionals.",
    initials: "OO",
    color: "var(--navy)",
    image: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784402552/Olalekan_j80keu.jpg", // [PLACEHOLDER — founder photo to be supplied]
  },
  {
    id: "babatunde",
    name: "Anthony Babatunde Peter",
    role: "Finance Analyst & Taxation Specialist",
    quals: "ABWA, ICAN, CITN, FMVA",
    bio: "A result-driven accounting professional with a First-Class degree from Redeemers University and 8+ years as a seasoned tutor in ICAN and ACCA taxation programs. Anthony combines academic excellence with practical expertise, having worked with 14+ firms including a Big 4 accounting firm. Currently Finance Analyst at PZ Cussons, he specializes in taxation, financial modeling, and has contributed to Nigeria's Presidential Committee on Fiscal Policy and Tax Reform.",
    initials: "AB",
    color: "var(--navy-dark)",
    image: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784402566/Anthony_Tunde_bq4utq.jpg",
  },
  {
    id: "motiu",
    name: "Motiu", // [PLACEHOLDER — full name to be supplied]
    role: "Head of Consultancy", // [PLACEHOLDER — confirm full title]
    quals: "ACA, MSc Finance", // [PLACEHOLDER — confirm credentials]
    bio: "Motiu heads PIN's business and financial consultancy practice, advising SMEs, corporations, and government agencies on financial reporting, taxation, and strategic planning. He brings boardroom-level insight into every client engagement.",
    initials: "MT",
    color: "var(--navy)",
    image: undefined, // [PLACEHOLDER — photo to be supplied]
  },
  {
    id: "priscilla",
    name: "Priscilla", // [PLACEHOLDER — full name to be supplied]
    role: "General Secretary",
    quals: "B.Sc Accounting", // [PLACEHOLDER — confirm credentials]
    bio: "Priscilla is the operational backbone of PIN Associate, managing student registrations, client relationships, and day-to-day administration. Her attention to detail ensures every student's journey from enquiry to qualification is seamless.",
    initials: "PR",
    color: "#92600A",
    image: undefined, // [PLACEHOLDER — photo to be supplied]
  },
];

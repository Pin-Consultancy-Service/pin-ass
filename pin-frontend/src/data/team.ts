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
    quals: "ACA, ICAN, ACCA", // [PLACEHOLDER — confirm full credentials]
    bio: "Olalekan founded PIN Associate with a single conviction: that every determined professional deserves a clear, structured path to qualification. With over 16 years building Nigeria's exam-prep landscape, he has personally overseen the training of more than 5,000 chartered accountants and finance professionals.",
    initials: "OO",
    color: "var(--navy)",
    image: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784402552/Olalekan_j80keu.jpg", // [PLACEHOLDER — founder photo to be supplied]
  },
  {
    id: "babatunde",
    name: "Anthony Babatunde Peter",
    role: "Finance Analyst & Taxation Specialist",
    quals: "ABWA, ACA (ICAN), ACITN, FMVA",
    bio: "Anthony is a result-driven professional with a passion for excellence in accounting and taxation. He holds a First-Class degree in Accounting from Redeemers University and is an Associate of ICAN, CITN, and ABWA, plus a Financial Modeling and Valuation Analyst (FMVA) from CFI. With 8+ years teaching ICAN and ACCA taxation, he has worked with 14+ firms including a Big 4 accounting firm and currently serves as Finance Analyst at PZ Cussons. Anthony served as Assistant Research Analyst on the Presidential Committee on Fiscal Policy and Tax Reform chaired by Taiwo Oyedele, and has facilitated numerous workshops leveraging his expertise to educate and inspire others. An unapologetic believer of Jesus Christ, he balances his professional excellence with creative interests in music, media, and photography.",
    initials: "AB",
    color: "var(--navy-dark)",
    image: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784402566/Anthony_Tunde_bq4utq.jpg",
  },
  {
    id: "motiu",
    name: "Mutiu Babajide Amao",
    role: "Senior Finance Analyst & Professional Tutor",
    quals: "ACA (ICAN), Executive MBA",
    bio: "Mutiu is a Chartered Accountant with extensive experience in financial reporting, treasury management, statutory tax compliance, and regulatory reporting. Currently Senior Finance Analyst at Nobleserve Finance Company Limited, he has progressed from Treasury Analyst since 2021, contributing to financial management, CBN regulatory returns, and strategic finance initiatives. He played a key role in the organization's Excel-to-BankOne ERP migration and was honored with Employee of the Year Award 2024. Since 2017, Mutiu has served as a professional accountancy tutor with PIN Associates for 9+ years, mentoring students in Management Accounting, Public Sector Accounting and Finance (PSAF), Taxation, and Advanced Taxation. He holds an Executive MBA from Obafemi Awolowo University and a B.Sc. in Accounting from University of Ilorin.",
    initials: "MB",
    color: "var(--navy)",
    image: "https://res.cloudinary.com/yaovkmpi/image/upload/v1795269203/mutiu-babajide_nfc4cl.jpg",
  },
  {
    id: "priscilla",
    name: "Priscilla", // [PLACEHOLDER — full name to be supplied]
    role: "General Secretary",
    quals: "B.Sc Accounting, ICAN, ACA", // [PLACEHOLDER — confirm credentials]
    bio: "Priscilla is the operational backbone of PIN Associate, managing student registrations, client relationships, and day-to-day administration. Her attention to detail ensures every student's journey from enquiry to qualification is seamless.",
    initials: "PR",
    color: "#92600A",
    image: "https://res.cloudinary.com/yaovkmpi/image/upload/v1794950689/Pricilla_pjuk4s.jpg",
  },
];

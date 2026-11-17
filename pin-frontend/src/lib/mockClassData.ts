// Shared mock class data - TODO: Replace with real API
// This will eventually come from backend based on user's cohort/diet

export interface ClassMaterial {
  name: string;
  url: string;
  size: string;
}

export interface ClassData {
  id: number;
  cohort: string;
  subject: string;
  topic: string;
  instructor: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM (24-hour)
  duration: number; // minutes
  googleMeetLink: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  attendance?: "present" | "absent";
  recordingUrl?: string;
  materials?: ClassMaterial[];
  description?: string;
}

export const mockClasses: ClassData[] = [
  // ✅ CLASS ENDED - Showing completed state with recording
  {
    id: 4,
    cohort: "ICAN Professional Level - Diet 1 2026",
    subject: "Financial Accounting",
    topic: "ICAN Revision Class - LIVE TEST",
    instructor: "Anthony Babatunde",
    scheduledDate: "2026-10-16", // Friday, October 16, 2026
    scheduledTime: "14:30", // 2:30 PM WAT
    duration: 45, // 2:30 PM - 3:15 PM
    googleMeetLink: "https://meet.google.com/twb-cavz-wsm", // 🎥 REAL MEETING LINK
    status: "completed", // ✅ CLASS ENDED
    attendance: "absent", // Student missed it - will show recording
    recordingUrl: "https://www.youtube.com/embed/07Nu1B2spwk", // ICAN video - embed format
    materials: [
      { name: "Financial_Statements_Intro.pdf", url: "#", size: "2.1MB" },
      { name: "Class_Notes.pdf", url: "#", size: "890KB" }
    ],
    description: "Class has ended. Since you missed this session, the recording is automatically displayed below for you to catch up!"
  },
  {
    id: 1,
    cohort: "ICAN Professional Level - Diet 1 2026",
    subject: "Financial Accounting",
    topic: "ICAN Revision Class - TEST WITH YOUR VIDEO",
    instructor: "Dr. Adebayo Johnson",
    scheduledDate: "2026-10-10", // Past date - shows as completed with recording
    scheduledTime: "14:30",
    duration: 120,
    googleMeetLink: "https://meet.google.com/abc-defg-hij",
    status: "completed",
    attendance: "absent",
    recordingUrl: "https://www.youtube.com/embed/XoOCfbTh4bQ", // ICAN video - embed format
    materials: [
      { name: "Lesson_1_Slides.pdf", url: "#", size: "2.4MB" },
      { name: "Practice_Exercises.pdf", url: "#", size: "1.1MB" }
    ],
    description: "📹 LIVE TEST: This class shows your actual Google Drive video embedded!"
  },
  {
    id: 2,
    cohort: "ICAN Professional Level - Diet 1 2026",
    subject: "Taxation",
    topic: "Personal Income Tax - PAYE System",
    instructor: "Prof. Fatima Bello",
    scheduledDate: "2026-10-08",
    scheduledTime: "10:00",
    duration: 120,
    googleMeetLink: "https://meet.google.com/xyz-uvwx-yz",
    status: "completed",
    attendance: "absent",
    recordingUrl: "https://www.youtube.com/embed/XoOCfbTh4bQ", // ICAN video - embed format
    materials: [
      { name: "PAYE_Calculation_Examples.xlsx", url: "#", size: "850KB" },
      { name: "Tax_Tables_2024.pdf", url: "#", size: "450KB" }
    ],
    description: "Detailed explanation of Nigeria's Pay As You Earn (PAYE) tax system."
  },
  {
    id: 3,
    cohort: "ACCA DIPIFR - January 2026",
    subject: "Corporate Reporting",
    topic: "Consolidation of Financial Statements",
    instructor: "Dr. Aisha Mohammed",
    scheduledDate: "2026-10-05",
    scheduledTime: "11:00",
    duration: 120,
    googleMeetLink: "https://meet.google.com/lmn-opqr-stu",
    status: "completed",
    attendance: "present",
    recordingUrl: "https://www.youtube.com/embed/XoOCfbTh4bQ", // ICAN video - embed format
    materials: [
      { name: "Consolidation_Guide.pdf", url: "#", size: "3.2MB" }
      
    ],
    description: "Step-by-step approach to consolidating parent and subsidiary financial statements."
  }
];


// Utility functions for class timing
export function getTimeUntilClass(scheduledDate: string, scheduledTime: string) {
  const [hours, minutes] = scheduledTime.split(':').map(Number);
  const classDateTime = new Date(scheduledDate);
  classDateTime.setHours(hours, minutes, 0, 0);
  
  const now = new Date();
  const diff = classDateTime.getTime() - now.getTime();
  
  if (diff <= 0) return null;
  
  const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
  const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { hours: hoursLeft, minutes: minutesLeft, total: diff };
}

export function isClassLive(scheduledDate: string, scheduledTime: string, duration: number) {
  const [hours, minutes] = scheduledTime.split(':').map(Number);
  const classStart = new Date(scheduledDate);
  classStart.setHours(hours, minutes, 0, 0);
  
  const classEnd = new Date(classStart.getTime() + duration * 60 * 1000);
  const now = new Date();
  
  // Class is live if:
  // 1. We're within 15 mins before start time, OR
  // 2. We're between start and end time
  const fifteenMinsBeforeStart = new Date(classStart.getTime() - 15 * 60 * 1000);
  
  return now >= fifteenMinsBeforeStart && now <= classEnd;
}

export function getUpcomingClasses(allClasses: ClassData[], withinMinutes: number = 60) {
  const now = new Date();
  
  return allClasses
    .filter(cls => {
      if (cls.status !== "scheduled") return false;
      
      const timeUntil = getTimeUntilClass(cls.scheduledDate, cls.scheduledTime);
      if (!timeUntil) return false;
      
      const minutesUntil = Math.floor(timeUntil.total / (1000 * 60));
      return minutesUntil > 0 && minutesUntil <= withinMinutes;
    })
    .sort((a, b) => {
      const timeA = getTimeUntilClass(a.scheduledDate, a.scheduledTime);
      const timeB = getTimeUntilClass(b.scheduledDate, b.scheduledTime);
      return (timeA?.total || 0) - (timeB?.total || 0);
    });
}

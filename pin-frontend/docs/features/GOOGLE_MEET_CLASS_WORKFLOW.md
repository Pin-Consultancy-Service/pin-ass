# Google Meet Class Workflow - Implementation Guide

## Overview
PIN Associate primarily conducts classes online via Google Meet, with occasional in-person sessions. The system uses **manual link entry** approach where admins create Google Meet meetings externally and paste the links into the platform.

## Why Manual Link Entry (Not API Integration)?

### ✅ Advantages:
1. **Simple & Reliable** - No OAuth complexity, no API quotas
2. **Flexible** - Use existing Google Workspace, customize settings
3. **Cost-Effective** - No Google Cloud project needed, no API maintenance
4. **More Control** - Admin sees exactly what meeting they're linking
5. **Future-Proof** - No breaking changes when Google updates APIs

### ❌ API Integration Would Require:
- Google Cloud project setup ($)
- OAuth 2.0 authentication flow
- Service account management
- API rate limit handling
- Webhook setup for meeting status
- Ongoing maintenance as APIs change

## Complete Workflow

### Phase 1: Admin Creates Class (Current)

**Step 1: Create Google Meet Meeting**
```
Admin goes to meet.google.com → "New Meeting" → Schedule in Google Calendar
- Set date, time, duration
- Add description
- Configure settings (recording, waiting room, etc.)
- Copy the meeting link
```

**Step 2: Add Class to PIN Associate System**
```
Admin Dashboard → "Create Class" button
- Course Name: e.g., "Python Programming - Basics"
- Instructor: Select from dropdown
- Date: 2024-12-15
- Start Time: 10:00 AM
- End Time: 12:00 PM
- Class Type: Online (default)
- Google Meet Link: paste https://meet.google.com/xxx-xxxx-xxx
- Capacity: 50
- Click "Create Class"
```

**System Actions:**
1. Validates the meeting link format
2. Stores class details in database
3. Sends email notifications to enrolled students
4. Shows class in Classes list (Admin, Instructor, Student portals)

### Phase 2: Student Sees Class

**Student Portal → Classes Page**
```
Upcoming Classes Section:
┌─────────────────────────────────────────┐
│ Python Programming - Basics              │
│ 📅 Dec 15, 2024 • 10:00 AM - 12:00 PM  │
│ 👨‍🏫 Instructor: Dr. Adewale Thompson     │
│ 🌐 Online via Google Meet                │
│                                          │
│ [Join Class] [View Details]             │
└─────────────────────────────────────────┘
```

**"Join Class" Button Logic:**
- **Before class start (-30 min):** Button disabled, shows "Starts in 25 minutes"
- **30 min before to end time:** Button active, opens Google Meet in new tab
- **After class ends:** Button shows "Class Ended", can view recording link if available

### Phase 3: Notifications & Reminders

**Automated Notifications:**
1. **When Class Created:**
   - Email to all enrolled students
   - "New class scheduled: Python Programming on Dec 15"
   - Includes "Add to Calendar" link

2. **24 Hours Before:**
   - Email reminder: "Class tomorrow at 10:00 AM"
   - Push notification (if enabled)
   - SMS (optional, for paid plans)

3. **30 Minutes Before:**
   - Email: "Class starting soon - Join now"
   - Push notification with direct link
   - In-app notification badge

4. **At Start Time:**
   - Push notification: "Class is live! Join now"
   - Dashboard shows "LIVE NOW" badge

### Phase 4: During Class

**Student Experience:**
- Clicks "Join Class" → Opens meet.google.com in new tab
- Joins with their registered name (pre-filled if possible)
- Attends class via Google Meet
- Google handles all video/audio/chat

**Instructor Experience:**
- Sees attendance list in admin portal (who clicked "Join")
- Can share materials via platform
- Google Meet handles the actual class delivery

**System Tracking:**
- Records when student clicks "Join Class" (attendance timestamp)
- Tracks session duration (optional)
- Stores attendance data for reports

### Phase 5: After Class

**Automated Actions:**
1. Mark class as "Completed" in database
2. Record attendance for students who joined
3. Trigger "How was the class?" feedback form
4. If recording enabled, admin can add recording link later
5. Update student progress/completion stats

## Updated CreateClassModal Features

### Form Fields:

```typescript
{
  courseName: string;           // "Python Programming - Basics"
  instructorId: string;          // Dropdown of instructors
  date: string;                  // Date picker
  startTime: string;             // Time picker
  endTime: string;               // Time picker
  type: 'online' | 'in-person' | 'hybrid';  // Toggle buttons
  meetingLink?: string;          // Google Meet URL (required for online)
  venue?: string;                // Physical location (required for in-person)
  capacity: number;              // Max students
}
```

### Visual Improvements:

1. **Class Type Selector:**
   - Three large toggle buttons (Online, In-Person, Hybrid)
   - Online is default (most common)
   - Visual indicator of selected type

2. **Conditional Fields:**
   - Online → Shows "Google Meet Link" field with helper text
   - In-Person → Shows "Physical Venue" field
   - Hybrid → Shows both fields

3. **Helper Text:**
   - "💡 Create the meeting in Google Meet first, then paste the link here"
   - Shows example format: https://meet.google.com/xxx-xxxx-xxx

4. **Validation:**
   - Checks if URL is valid Google Meet or Zoom link
   - Ensures all required fields filled based on type
   - Validates date is in the future
   - Validates end time is after start time

## Database Schema

### Classes Table:
```sql
CREATE TABLE classes (
  id VARCHAR PRIMARY KEY,
  course_name VARCHAR NOT NULL,
  instructor_id VARCHAR REFERENCES users(id),
  class_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  type ENUM('online', 'in-person', 'hybrid') DEFAULT 'online',
  meeting_link VARCHAR,           -- Google Meet URL
  venue VARCHAR,                  -- Physical location
  capacity INT DEFAULT 50,
  status ENUM('scheduled', 'live', 'completed', 'cancelled'),
  recording_link VARCHAR,         -- Added after class if recorded
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Attendance Tracking:
```sql
CREATE TABLE class_attendance (
  id VARCHAR PRIMARY KEY,
  class_id VARCHAR REFERENCES classes(id),
  student_id VARCHAR REFERENCES users(id),
  joined_at TIMESTAMP,           -- When clicked "Join"
  left_at TIMESTAMP,             -- Calculated or manual
  duration_minutes INT,
  status ENUM('present', 'absent', 'late'),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints Needed

### Admin:
```
POST   /api/admin/classes              # Create new class
PATCH  /api/admin/classes/:id          # Update class (change link, time, etc.)
DELETE /api/admin/classes/:id          # Cancel class
POST   /api/admin/classes/:id/notify   # Send reminders manually
```

### Student:
```
GET    /api/student/classes            # Get enrolled classes
POST   /api/student/classes/:id/join   # Record attendance (clicked join)
GET    /api/student/classes/:id/link   # Get meeting link (security check)
```

### Instructor:
```
GET    /api/instructor/classes         # Get assigned classes
GET    /api/instructor/classes/:id/attendance  # View attendance
POST   /api/instructor/classes/:id/recording   # Add recording link
```

## Notification Templates

### Email: New Class Scheduled
```
Subject: New Class Scheduled - Python Programming

Hi [Student Name],

A new class has been scheduled:

📚 Course: Python Programming - Basics
👨‍🏫 Instructor: Dr. Adewale Thompson
📅 Date: December 15, 2024
⏰ Time: 10:00 AM - 12:00 PM (WAT)
🌐 Mode: Online via Google Meet

[Add to Google Calendar] [Add to Outlook]

You'll receive a reminder 24 hours and 30 minutes before class.

[View Class Details in Portal]

Best regards,
PIN Associate Team
```

### Email: Class Starting Soon (30 min)
```
Subject: ⏰ Class Starting in 30 Minutes - Join Now

Hi [Student Name],

Your class is starting soon!

Python Programming - Basics
Starts at: 10:00 AM (in 30 minutes)

[Join Class Now] ← Click to join Google Meet

See you there!
```

## Security Considerations

1. **Link Validation:**
   - Only allow meet.google.com or zoom.us domains
   - Prevent JavaScript injection in URLs
   - Sanitize all input

2. **Access Control:**
   - Only enrolled students can see "Join" button
   - Rate limit join button clicks (prevent spam)
   - Log all join attempts

3. **Meeting Link Privacy:**
   - Don't show full link until 30 min before class
   - Show "Link will be available 30 minutes before class"
   - Prevents unauthorized access

## Future Enhancements (Optional)

### Phase 2 Features:
1. **Recording Management:**
   - Admin can upload/link recording after class
   - Students access recordings in Materials section
   - Auto-expire after 90 days (storage management)

2. **Attendance Verification:**
   - Generate unique join codes
   - Students enter code during class to verify attendance
   - Prevents "click and leave" false attendance

3. **Integration with Google Calendar:**
   - Parse Google Calendar event URLs
   - Extract meeting details automatically
   - Sync calendar events to platform

4. **WhatsApp Reminders:**
   - Send class reminders via WhatsApp API
   - "Join Class" button in WhatsApp message
   - Higher engagement than email

## Implementation Priority

### ✅ Now (MVP):
1. Update CreateClassModal with new fields
2. Add meeting link validation
3. Show "Join Class" button on student classes page
4. Record attendance when clicked
5. Basic email notifications

### 📅 Phase 2 (After Launch):
1. Advanced notification system (SMS, WhatsApp)
2. Recording management
3. Attendance verification codes
4. Analytics dashboard

### 🔮 Future:
1. Google Calendar integration
2. Automatic meeting creation via API
3. Virtual waiting room
4. Breakout room management

---

**Status:** ✅ **Ready to Implement**  
**Complexity:** 🟢 **Low** (No API integration needed)  
**Maintenance:** 🟢 **Low** (Simple URL storage)  
**User Experience:** 🟢 **Excellent** (Familiar Google Meet interface)

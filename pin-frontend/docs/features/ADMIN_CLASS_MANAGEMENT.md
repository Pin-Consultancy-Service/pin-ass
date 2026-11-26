# Admin Portal - Class Management System

## 🎯 Overview

The admin portal will allow instructors and administrators to manage live classes, upload recordings, and control what students see - all without touching code!

---

## 👥 **Who Can Do What?**

### **Super Admin** (Full Access)
- ✅ Create/edit/delete classes
- ✅ Schedule Google Meet sessions
- ✅ Upload recordings
- ✅ Manage materials
- ✅ View all cohorts
- ✅ Assign instructors
- ✅ Mark attendance

### **Instructor** (Their Classes Only)
- ✅ Create their own classes
- ✅ Schedule Google Meet
- ✅ Upload recordings after class
- ✅ Upload materials
- ✅ View their students
- ✅ Mark attendance
- ❌ Cannot see other instructors' classes

### **Content Manager**
- ✅ Upload recordings
- ✅ Manage materials
- ✅ View schedules
- ❌ Cannot create classes
- ❌ Cannot mark attendance

---

## 🖥️ **Admin Portal - Classes Management Interface**

### **Main Dashboard View:**

```
┌─────────────────────────────────────────────────────────┐
│  📚 Classes Management                    [+ New Class] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Filters: [All] [Upcoming] [Live] [Completed]          │
│           Cohort: [ICAN Diet 1 ▼]  Instructor: [All ▼] │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📅 Upcoming Classes (3)                                │
│  ┌───────────────────────────────────────────────┐    │
│  │ Financial Accounting                          │    │
│  │ Introduction to Financial Statements          │    │
│  │ 👤 Anthony Babatunde • Oct 16, 2:30 PM       │    │
│  │ 🎓 ICAN Diet 1 • 📹 Meet: meet.google.com/... │    │
│  │                                               │    │
│  │ [Edit] [Cancel] [View Students] [Materials]  │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │ Taxation - PAYE System                        │    │
│  │ 👤 Prof. Fatima Bello • Oct 17, 10:00 AM     │    │
│  │ 🎓 ICAN Diet 1 • ⚠️ No recording uploaded    │    │
│  │                                               │    │
│  │ [Edit] [Cancel] [Upload Recording]           │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
│  🔴 Live Now (0)                                        │
│  ✅ Completed This Week (5)                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ➕ **Creating a New Class**

When admin clicks **"+ New Class"**, they see a form:

### **Step 1: Basic Details**

```
┌─────────────────────────────────────────────┐
│  Create New Live Class                      │
├─────────────────────────────────────────────┤
│                                             │
│  Subject *                                  │
│  [Financial Accounting                  ▼] │
│                                             │
│  Topic/Title *                              │
│  [Introduction to Financial Statements   ] │
│                                             │
│  Description                                │
│  [Join us for an interactive intro to...  ] │
│  [                                         ] │
│                                             │
│  Cohort/Diet *                              │
│  [ICAN Professional - Diet 1 2024       ▼] │
│                                             │
│  Instructor *                               │
│  [Anthony Babatunde                     ▼] │
│                                             │
│         [Cancel]           [Next: Schedule] │
└─────────────────────────────────────────────┘
```

### **Step 2: Schedule & Google Meet**

```
┌─────────────────────────────────────────────┐
│  Schedule Live Class                        │
├─────────────────────────────────────────────┤
│                                             │
│  Date *                                     │
│  [Oct 16, 2026                         📅] │
│                                             │
│  Start Time *                               │
│  [2:30 PM                              🕐] │
│                                             │
│  Duration (minutes) *                       │
│  [45                                    ▼] │
│  Common: 45, 60, 90, 120 minutes            │
│                                             │
│  🎥 Google Meet Link *                      │
│  [https://meet.google.com/twb-cavz-wsm   ] │
│                                             │
│  ℹ️ How to get Google Meet link:            │
│  1. Go to Google Calendar                   │
│  2. Create event with Google Meet           │
│  3. Copy the meet.google.com/xxx link       │
│  4. Paste it here                           │
│                                             │
│  OR: [🔗 Generate Meet Link Automatically]  │
│       (Requires Google API setup)           │
│                                             │
│         [Back]               [Next: Materials]│
└─────────────────────────────────────────────┘
```

### **Step 3: Class Materials (Optional)**

```
┌─────────────────────────────────────────────┐
│  Upload Class Materials                     │
├─────────────────────────────────────────────┤
│                                             │
│  📚 Materials (Optional)                    │
│                                             │
│  [📎 Drop files here or click to upload]   │
│                                             │
│  Uploaded Files:                            │
│  ┌───────────────────────────────────┐    │
│  │ 📄 Lesson_1_Slides.pdf (2.4MB)    │[X] │
│  │ 📊 Practice_Exercises.xlsx (890KB)│[X] │
│  └───────────────────────────────────┘    │
│                                             │
│  Allowed: PDF, DOCX, PPTX, XLSX            │
│  Max size: 10MB per file                    │
│                                             │
│         [Back]      [Create Class & Notify] │
└─────────────────────────────────────────────┘
```

**What Happens Next:**
1. ✅ Class saved to database
2. ✅ Students in that cohort get notified
3. ✅ Class appears on student portal
4. ✅ Countdown timer starts automatically
5. ✅ Notifications trigger at right times

---

## 📹 **After Class: Upload Recording**

### **Automatic Upload (Recommended)**

When admin enables **Google Meet Recording**:
1. Google Meet auto-records the session
2. Recording uploads to Google Drive
3. Backend API automatically fetches the recording URL
4. Recording appears on student portal **without admin doing anything!**

### **Manual Upload**

If admin needs to upload manually:

```
┌─────────────────────────────────────────────┐
│  Upload Class Recording                     │
├─────────────────────────────────────────────┤
│                                             │
│  Class: Financial Accounting - Oct 16       │
│  Instructor: Anthony Babatunde              │
│                                             │
│  📹 Recording Source                        │
│  ● Google Drive Link (Recommended)          │
│  ○ Upload Video File                        │
│                                             │
│  Google Drive Video URL *                   │
│  [https://drive.google.com/file/d/...    ] │
│                                             │
│  ℹ️ How to share from Google Drive:         │
│  1. Upload video to Google Drive            │
│  2. Right-click → Share                     │
│  3. Change to "Anyone with link"            │
│  4. Copy link and paste here                │
│                                             │
│  📊 Recording Details (Optional)            │
│  Duration: [45 minutes]                     │
│  Recording Date: [Oct 16, 2026]             │
│                                             │
│  🔔 Notify students who missed?             │
│  [✓] Send email to absent students          │
│  [✓] Send in-app notification               │
│                                             │
│         [Cancel]       [Upload & Notify]    │
└─────────────────────────────────────────────┘
```

**What Happens:**
1. ✅ Recording link saved to database
2. ✅ Students who missed see it automatically
3. ✅ Notifications sent to absent students
4. ✅ Video embedded on Classes page

---

## ✏️ **Editing a Class**

Admin can edit before class starts:

```
┌─────────────────────────────────────────────┐
│  Edit Class                                 │
├─────────────────────────────────────────────┤
│                                             │
│  Financial Accounting - Live Test           │
│  Status: Scheduled • Oct 16, 2:30 PM        │
│                                             │
│  [Basic Details] [Schedule] [Materials]     │
│                                             │
│  ✏️ Update any field and save               │
│  ⚠️ Students will be notified of changes    │
│                                             │
│  Actions:                                   │
│  [Save Changes]                             │
│  [Cancel Class]                             │
│  [Duplicate Class]                          │
│  [View Student List]                        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 👥 **Managing Attendance**

After class ends:

```
┌─────────────────────────────────────────────┐
│  Mark Attendance                            │
├─────────────────────────────────────────────┤
│                                             │
│  Class: Financial Accounting - Oct 16       │
│  Total Students: 25                         │
│                                             │
│  Search: [Student name...            🔍]    │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ [✓] John Doe          Present        │  │
│  │ [✓] Jane Smith        Present        │  │
│  │ [ ] Mike Johnson      Absent         │  │
│  │ [✓] Sarah Williams    Present        │  │
│  │ [ ] David Brown       Absent         │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  Quick Actions:                             │
│  [Mark All Present] [Mark All Absent]       │
│  [Import from Google Meet]                  │
│                                             │
│         [Cancel]       [Save Attendance]    │
└─────────────────────────────────────────────┘
```

**What Happens:**
- ✅ Students marked "Absent" → see recording automatically
- ✅ Students marked "Present" → recording available but not auto-shown
- ✅ Attendance saved to database
- ✅ Reports generated automatically

---

## 🔄 **Backend API Integration**

### **API Endpoints Needed:**

```typescript
// Classes CRUD
POST   /api/admin/classes              // Create new class
GET    /api/admin/classes              // List all classes
GET    /api/admin/classes/:id          // Get single class
PUT    /api/admin/classes/:id          // Update class
DELETE /api/admin/classes/:id          // Delete class

// Recording Management
POST   /api/admin/classes/:id/recording // Upload recording
GET    /api/admin/classes/:id/recording // Get recording details
DELETE /api/admin/classes/:id/recording // Remove recording

// Materials Management
POST   /api/admin/classes/:id/materials // Upload material
DELETE /api/admin/materials/:id         // Delete material

// Attendance
GET    /api/admin/classes/:id/students  // Get student list
POST   /api/admin/classes/:id/attendance // Mark attendance
GET    /api/admin/classes/:id/attendance // Get attendance

// Google Meet Integration (Optional)
POST   /api/admin/google-meet/create    // Auto-create meet link
GET    /api/admin/google-meet/:id/recording // Fetch recording
```

### **Database Schema:**

```sql
-- Classes Table
CREATE TABLE classes (
  id UUID PRIMARY KEY,
  cohort_id UUID REFERENCES cohorts(id),
  subject VARCHAR(255) NOT NULL,
  topic VARCHAR(500) NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES users(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration INTEGER NOT NULL, -- minutes
  google_meet_link TEXT,
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, live, completed, cancelled
  recording_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Class Materials Table
CREATE TABLE class_materials (
  id UUID PRIMARY KEY,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(50),
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Attendance Table
CREATE TABLE class_attendance (
  id UUID PRIMARY KEY,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'absent', -- present, absent, late
  marked_at TIMESTAMP DEFAULT NOW(),
  marked_by UUID REFERENCES users(id),
  UNIQUE(class_id, student_id)
);
```

---

## 🔔 **Automatic Notifications**

When admin creates/updates a class, students automatically get notified:

### **Notification Types:**

1. **Class Created**
   ```
   📚 New Live Class Scheduled!
   
   Financial Accounting - Introduction to Financial Statements
   📅 Oct 16, 2026 at 2:30 PM
   👤 Anthony Babatunde
   
   [View Class Details]
   ```

2. **Class Updated**
   ```
   ⚠️ Class Time Changed
   
   Financial Accounting has been rescheduled:
   New Time: Oct 17, 3:00 PM (was Oct 16, 2:30 PM)
   
   [View Updated Schedule]
   ```

3. **Recording Uploaded**
   ```
   📹 Recording Available
   
   You missed: Financial Accounting - Oct 16
   The class recording is now available.
   
   [Watch Recording]
   ```

---

## 📊 **Admin Reports & Analytics**

Admin can view:

```
┌─────────────────────────────────────────────┐
│  Classes Analytics                          │
├─────────────────────────────────────────────┤
│                                             │
│  This Month:                                │
│  📅 20 Classes Scheduled                    │
│  ✅ 15 Completed                            │
│  🔴 2 Live Now                              │
│  📹 18 Recordings Uploaded                  │
│                                             │
│  Attendance Rate: 85%                       │
│  Average Class Duration: 52 minutes         │
│                                             │
│  Top Attended Classes:                      │
│  1. Financial Accounting (95%)              │
│  2. Taxation (88%)                          │
│  3. Auditing (82%)                          │
│                                             │
│  Students Needing Follow-up (Missed 3+):    │
│  - John Doe (5 missed)                      │
│  - Sarah Williams (4 missed)                │
│                                             │
│  [Export Report] [View Detailed Analytics]  │
└─────────────────────────────────────────────┘
```

---

## 🎨 **Admin Portal UI Design**

### **Technology Stack:**
- **Frontend**: Same Next.js/React (consistent with student portal)
- **Design**: Same design system (navy, gold colors)
- **Layout**: Sidebar with admin-specific menu items

### **Menu Structure:**
```
Admin Portal
├─ 📊 Dashboard (Overview stats)
├─ 📚 Classes Management (Main interface)
│  ├─ All Classes
│  ├─ Create New Class
│  ├─ Upcoming Classes
│  ├─ Past Classes
│  └─ Recordings Library
├─ 👥 Students Management
├─ 👨‍🏫 Instructors Management
├─ 🎓 Cohorts/Diets Management
├─ 📁 Materials Library
├─ 📧 Notifications Center
└─ ⚙️ Settings
```

---

## 🚀 **Implementation Phases**

### **Phase 1: Basic Class Management** (2-3 weeks)
- ✅ Create/edit/delete classes
- ✅ Manual Google Meet link input
- ✅ Basic student list view
- ✅ Manual recording upload (Google Drive link)

### **Phase 2: Attendance & Materials** (1-2 weeks)
- ✅ Mark attendance
- ✅ Upload materials (PDFs, docs)
- ✅ Student sees materials automatically

### **Phase 3: Automation** (2-3 weeks)
- ✅ Google Meet API integration (auto-create links)
- ✅ Auto-fetch recordings from Google Drive
- ✅ Auto-notifications at right times
- ✅ Auto-import attendance from Google Meet

### **Phase 4: Analytics & Reports** (1-2 weeks)
- ✅ Attendance reports
- ✅ Class performance analytics
- ✅ Student engagement metrics
- ✅ Export to Excel/PDF

---

## 🔐 **Security & Permissions**

### **Role-Based Access Control:**

```typescript
// Admin can do everything
if (user.role === 'admin') {
  allowAll();
}

// Instructor can only manage their classes
if (user.role === 'instructor') {
  allow(['create_class', 'edit_own_class', 'upload_recording']);
  checkOwnership(class.instructor_id === user.id);
}

// Content manager can upload materials
if (user.role === 'content_manager') {
  allow(['upload_materials', 'view_classes']);
}
```

---

## 💡 **Key Features Summary**

### **For Admins:**
1. ✅ **Create classes in 3 steps** (no code needed!)
2. ✅ **Paste Google Meet link** (from Google Calendar)
3. ✅ **Upload recordings** (from Google Drive)
4. ✅ **Mark attendance** (auto-shows recording for absent students)
5. ✅ **Upload materials** (drag-and-drop PDFs)
6. ✅ **View analytics** (who attended, who watched recordings)

### **For Students:**
1. ✅ **See classes automatically** (as soon as admin creates)
2. ✅ **Get notifications** (30min, 15min, 5min before)
3. ✅ **Join with one click** (green button opens Google Meet)
4. ✅ **Recording auto-shows** (if they missed the class)
5. ✅ **Download materials** (uploaded by admin)

---

## 🎯 **Answer to Your Question:**

**Yes!** Admins will be able to:
- ✅ Create classes through a web form (no code!)
- ✅ Paste Google Meet links from Google Calendar
- ✅ Upload recordings from Google Drive (paste URL)
- ✅ Upload materials (PDFs, documents)
- ✅ Mark attendance (which triggers auto-recording display)
- ✅ Everything appears on student portal **automatically**

**No coding required** - just a user-friendly admin interface! 🎉

---

## 📞 **Next Steps:**

1. **Review this plan** - Does it cover everything you need?
2. **Prioritize features** - What should we build first?
3. **Backend setup** - Need to set up API and database
4. **Google API** - Optional: Auto-create meets, auto-fetch recordings
5. **Start with Phase 1** - Basic class creation first

Let me know what you think! 🚀

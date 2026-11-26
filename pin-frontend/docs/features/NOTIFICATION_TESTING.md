# Live Class Notification System - Testing Guide

## Overview
The student portal now has a comprehensive notification system that alerts students about upcoming live classes through multiple channels.

## Notification Channels

### 1. **Notification Bell Icon** (Dashboard Header)
- Shows badge count of upcoming classes (next 24 hours)
- Badge turns RED and pulses when class is ≤15 minutes away
- Click to see dropdown list of upcoming classes

### 2. **Dropdown List**
- Shows all classes starting within the next 24 hours
- Each class shows:
  - Subject & topic
  - Time remaining (formatted nicely)
  - Urgency indicator (red for ≤15 min, blue otherwise)
- Click any class to go to Classes page

### 3. **Top Banner**
- Appears when class is ≤30 minutes away
- Color-coded by urgency:
  - 🔴 **RED** - Class starting NOW (0-5 min)
  - 🟡 **ORANGE** - Very soon (6-15 min)
  - 🔵 **BLUE** - Coming up (16-30 min)
- Shows "Join Now" or "View Class" button
- Can be dismissed (but reappears on page refresh if still relevant)

### 4. **Browser Push Notifications**
- Requires user permission (auto-requested after 5 seconds)
- Sends at key times:
  - **30 minutes before** - "Class Starting Soon!"
  - **5 minutes before** - "Class Starting in 5 Minutes!" (stays on screen)
  - **At start time** - "Class is Live Now! 🔴" (stays on screen)

---

## How to Test

### Step 1: Enable an Upcoming Class

Open `src/lib/mockClassData.ts` and uncomment the test class at the bottom (around line 75):

```typescript
export const mockClasses: ClassData[] = [
  // ... existing past classes ...
  
  // 🔔 UNCOMMENT THIS BLOCK FOR TESTING:
  {
    id: 4,
    cohort: "ICAN Professional Level - Diet 1 2024",
    subject: "Auditing",
    topic: "Risk Assessment and Internal Controls",
    instructor: "Dr. Chukwu Obi",
    scheduledDate: "2026-10-16", // 👈 Set to TODAY's date (YYYY-MM-DD)
    scheduledTime: "16:00", // 👈 Set to ~45 minutes from NOW
    duration: 120,
    googleMeetLink: "https://meet.google.com/test-meet-link",
    status: "scheduled", // Must be "scheduled" for notifications
    materials: [
      { name: "Audit_Framework.pdf", url: "#", size: "1.8MB" }
    ],
    description: "Understanding audit risk and evaluating internal control systems."
  }
];
```

### Step 2: Set the Date and Time

1. **Date**: Change `scheduledDate` to TODAY's date in format `YYYY-MM-DD`
   - Example: If today is October 16, 2026: `"2026-10-16"`

2. **Time**: Set `scheduledTime` to approximately 45-60 minutes from current time
   - Use 24-hour format: `"HH:MM"`
   - Example: If it's 3:00 PM now, set it to `"16:00"` (4:00 PM)
   - This lets you see the countdown and test different notification states

3. **Save the file** - Hot reload should update immediately

### Step 3: Navigate to Student Portal

1. Go to `/portal/login`
2. Login with any credentials (TEST_MODE accepts anything)
3. You should see the Dashboard with the notification bell

### Step 4: Observe Notification Behavior

#### Immediately (45-60 min before class):
- ✅ Bell icon shows badge with "1"
- ✅ Click bell → dropdown shows upcoming class with time remaining
- ❌ No top banner yet (only appears at ≤30 min)
- ✅ Browser notification permission request appears

#### At 30 minutes before:
- ✅ **TOP BANNER APPEARS** (blue background)
- ✅ Browser push notification sent (if permission granted)
- ✅ Bell badge still visible

#### At 15 minutes before:
- ✅ **TOP BANNER TURNS ORANGE**
- ✅ Bell badge turns RED and PULSES
- ✅ Dropdown shows red urgent indicator

#### At 5 minutes before:
- ✅ **TOP BANNER TURNS RED**
- ✅ Banner text: "CLASS STARTING NOW!" with pulse animation
- ✅ "View Class" button changes to "Join Now"
- ✅ Browser push notification sent (requires interaction)

#### At class start time:
- ✅ Browser push: "Class is Live Now! 🔴"
- ✅ Classes page auto-opens Google Meet embed
- ✅ Banner remains until class ends

---

## Testing Multiple Classes

To test multiple notifications, add more test classes with different times:

```typescript
{
  id: 5,
  subject: "Taxation",
  topic: "Corporate Tax Returns",
  scheduledDate: "2026-10-16",
  scheduledTime: "17:30", // Different time
  status: "scheduled",
  // ... other fields
}
```

The bell badge will show "2", dropdown will list both classes ordered by urgency.

---

## Testing Browser Notifications

### If Permission Not Granted:
- Yellow footer appears in dropdown: "Enable Browser Notifications"
- Click button to manually request permission

### If Permission Denied:
- Browser notifications won't work
- All other notifications (bell, banner, dropdown) still work
- To reset: Go to browser settings → Site permissions → Notifications

---

## Notification Timing Details

| Time Before Class | Bell Badge | Banner | Color | Browser Push |
|------------------|------------|---------|-------|--------------|
| 24 hours | ✅ | ❌ | - | ❌ |
| 60 minutes | ✅ | ❌ | - | ❌ |
| 30 minutes | ✅ | ✅ | Blue | ✅ |
| 15 minutes | ✅ RED | ✅ | Orange | ❌ |
| 5 minutes | ✅ RED | ✅ | Red | ✅ |
| 0 minutes (start) | ✅ RED | ✅ | Red | ✅ |
| After end | ❌ | ❌ | - | ❌ |

---

## Files Involved

- **Data & Logic**: `src/lib/mockClassData.ts`
- **Notification Component**: `src/components/portal/ClassNotifications.tsx`
- **Dashboard Integration**: `src/components/portal/DashboardLayout.tsx`
- **Classes Page**: `src/components/portal/student/StudentClassesContent.tsx`

---

## Future: Real API Integration

When connecting to the backend API:

1. Replace `mockClasses` with API call to `/api/classes?cohort={userCohort}`
2. Filter by user's enrolled cohort/diet
3. Consider using WebSocket for real-time updates instead of 60-second polling
4. Add email notifications via backend
5. Add SMS notifications (optional, via Twilio)
6. Store notification preferences per user

---

## Troubleshooting

### Notifications Not Showing
1. Check that `status: "scheduled"` (not "completed" or "cancelled")
2. Verify date is TODAY or future
3. Verify time is in future
4. Check browser console for errors

### Banner Not Appearing
- Only shows when class is ≤30 minutes away
- Check that you didn't dismiss it (dismissed state stored in component)
- Refresh page to reset dismissed state

### Browser Notifications Not Working
- Check browser permission (Settings → Site Settings → Notifications)
- Some browsers block on localhost - test on HTTPS in production
- Check browser console for permission errors

### Bell Badge Not Updating
- Notifications update every 60 seconds
- Refresh page to force update
- Check that class time hasn't passed

---

## Notes

- ⏱️ **Clock updates every 60 seconds** - countdown times refresh each minute
- 🔔 **Badge count** shows classes in next 24 hours only
- 🎨 **Color coding** is automatic based on time remaining
- 🔊 **Sound notifications** not implemented (can add later)
- 📱 **Mobile responsive** - works on all screen sizes

---

## Next Steps

1. **Test the system** with multiple upcoming classes
2. **Verify** all notification channels work
3. **Consider** adding notification sound
4. **Plan** backend API integration
5. **Add** user notification preferences (email, SMS, frequency)

# 🔴 LIVE Test Session - Ready to Join!

## 📅 Meeting Details

**Title**: Financial Accounting - Live Class Test  
**Instructor**: Anthony Babatunde  
**Date**: Friday, October 16, 2026  
**Time**: 2:30 PM - 3:15 PM (WAT - West Africa Time)  
**Duration**: 45 minutes  
**Google Meet**: https://meet.google.com/twb-cavz-wsm  

---

## ✅ What's Now Active

Your real Google Meet session is now integrated into the student portal! Students can:

1. ✅ See countdown timer to class start
2. ✅ Get notifications (bell badge, top banner, browser push)
3. ✅ Click "Join Live Class" button
4. ✅ Google Meet embeds directly in the page
5. ✅ Join your actual live meeting at 2:30 PM

---

## 🧪 How to Test (Step-by-Step)

### **Before 2:30 PM (Testing Notifications)**

1. **Navigate to Student Portal**
   - Go to: `http://localhost:3000/portal/login`
   - Login with any credentials (TEST_MODE enabled)

2. **Check Dashboard Header**
   - Look at top-right corner → see notification bell
   - Bell should show badge with "1" (one upcoming class)
   - Click bell → see dropdown with your class details

3. **Wait for Notifications** (based on current time)
   - **60 min before (1:30 PM)**: Badge visible, no banner yet
   - **30 min before (2:00 PM)**: 🔵 BLUE banner appears + browser notification
   - **15 min before (2:15 PM)**: 🟡 ORANGE banner + badge turns RED and PULSES
   - **5 min before (2:25 PM)**: 🔴 RED banner "CLASS STARTING NOW!"
   - **At 2:30 PM**: Google Meet auto-opens on Classes page

4. **Navigate to Classes Page**
   - Click "Classes" in sidebar
   - OR click "View Class" in notification banner
   - OR click class in dropdown

---

### **At 2:30 PM (Join Live Meeting)**

1. **On Classes Page**
   - You'll see the class card with countdown
   - When time reaches 2:30 PM, countdown shows "Class is LIVE!"
   - Big green "Join Live Class" button appears
   - Click the button

2. **Google Meet Embed**
   - Google Meet loads directly in the page (no redirect!)
   - You'll see the meeting interface
   - Click "Join now" to enter the meeting
   - OR click "Open in Google Meet" to open in new tab

3. **Meeting Features**
   - Camera and microphone controls
   - Chat, screen share, participants list
   - Full Google Meet functionality embedded!

---

## 🎥 What the Embedded Google Meet Looks Like

```
┌─────────────────────────────────────────┐
│  Financial Accounting - LIVE            │
│  Anthony Babatunde                      │
│  ⏰ Class is LIVE! • 45 min duration   │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────────────────────────────┐      │
│   │                             │      │
│   │   [Google Meet Interface]   │      │
│   │                             │      │
│   │   Camera preview            │      │
│   │   Join now  |  Open in tab │      │
│   │                             │      │
│   └─────────────────────────────┘      │
│                                         │
│  📚 Class Materials                     │
│  [Download] Financial_Statements.pdf    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔔 Notification Timeline

| Time | What Happens |
|------|-------------|
| 1:30 PM | Notification bell shows badge "1" |
| 2:00 PM | 🔵 Blue banner appears: "Class starts in 30 minutes" |
| 2:00 PM | Browser push: "Class Starting Soon!" |
| 2:15 PM | 🟡 Orange banner: "Class starts in 15 minutes" |
| 2:15 PM | Badge turns RED and PULSES |
| 2:25 PM | 🔴 Red banner: "CLASS STARTING NOW!" |
| 2:25 PM | Browser push: "Class Starting in 5 Minutes!" |
| 2:30 PM | Browser push: "Class is Live Now! 🔴" |
| 2:30 PM | Google Meet auto-opens on Classes page |
| 2:30 PM | "Join Live Class" button active |
| 3:15 PM | Class ends, notifications clear |

---

## 📱 Testing Checklist

### Before Class (Notifications)
- [ ] Bell icon shows badge count
- [ ] Click bell → see class in dropdown
- [ ] Blue banner appears at 2:00 PM
- [ ] Browser notification at 2:00 PM (requires permission)
- [ ] Orange banner at 2:15 PM
- [ ] Badge turns RED and pulses at 2:15 PM
- [ ] Red banner at 2:25 PM
- [ ] Browser notification at 2:25 PM
- [ ] Browser notification at 2:30 PM

### During Class (Live Meeting)
- [ ] Navigate to Classes page
- [ ] See "Class is LIVE!" message
- [ ] Click "Join Live Class" button
- [ ] Google Meet loads in page
- [ ] Can join the meeting
- [ ] Audio/video controls work
- [ ] Can open in new tab if needed
- [ ] Class materials are downloadable

### After Class
- [ ] Notifications clear automatically
- [ ] Class status changes from "scheduled" to "completed"
- [ ] Recording link available (if recorded)

---

## 🚨 Troubleshooting

### Google Meet Not Embedding?
- **Issue**: Google Meet shows "Open in new tab" instead of embedding
- **Cause**: Google Meet's iframe embedding has restrictions
- **Solution**: This is expected. Click "Open in Google Meet" to join in new tab.
- **Note**: Some Google Workspace accounts allow embedding, others don't.

### Notifications Not Showing?
- Check system time matches your timezone (Africa/Lagos)
- Make sure browser notifications are enabled
- Refresh page to reset notification state
- Check browser console for errors

### Countdown Not Working?
- Verify system date is October 16, 2026
- Check time is before 2:30 PM
- Refresh page to update countdown
- Open browser dev tools → check for JS errors

### Bell Badge Not Appearing?
- Class must be within 24 hours to show badge
- Status must be "scheduled" (not "completed")
- Time must be in the future
- Check `mockClassData.ts` for correct date/time

---

## 🎯 What to Look For

### ✅ **Success Indicators:**
1. Countdown timer updates every minute
2. Notifications trigger at correct times
3. Banner color changes based on urgency
4. Bell badge pulses when urgent
5. Google Meet link is clickable
6. Meeting can be joined successfully
7. Materials are accessible

### ❌ **Potential Issues:**
1. System time doesn't match WAT timezone
2. Google Meet requires opening in new tab (not an error!)
3. Browser notifications blocked (check browser settings)
4. Date/time set incorrectly in mock data

---

## 📞 During the Live Test

When testing at 2:30 PM:

1. **Join from Student Portal** (embedded view)
2. **Join from Google Calendar** (to test as instructor)
3. **Verify both can see/hear each other**
4. **Test screen sharing** (if needed)
5. **Test chat functionality**
6. **Test participant controls**

---

## 🎓 Next Steps After Testing

Once you've tested the live session:

1. ✅ Verify all notifications worked
2. ✅ Confirm Google Meet embedding works (or opens in tab)
3. ✅ Check that students can join successfully
4. ✅ Test on mobile devices (responsive design)
5. 📝 Document any issues found
6. 🚀 Plan for production deployment

---

## 💡 Tips

- **Test Early**: Join 5 minutes before (2:25 PM) to test countdown
- **Multiple Devices**: Test on phone, tablet, desktop
- **Multiple Browsers**: Chrome, Firefox, Safari
- **Incognito Mode**: Test as "new user" without cached data
- **Network**: Test on different network speeds

---

## 🔗 Quick Links

- **Student Portal**: http://localhost:3000/portal/login
- **Classes Page**: http://localhost:3000/portal/student/classes
- **Google Meet**: https://meet.google.com/twb-cavz-wsm
- **Google Calendar Event**: (your calendar link)

---

**Ready to test! The meeting starts at 2:30 PM WAT (in approximately [X] minutes).** 🚀

Good luck with your live test session, Anthony! 🎉

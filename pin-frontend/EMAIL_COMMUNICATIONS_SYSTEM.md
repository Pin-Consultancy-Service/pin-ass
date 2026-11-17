# Email Communications System - Admin Dashboard

## Overview
A comprehensive email management system for sending professional, branded emails to students from the admin dashboard.

## Features

### 1. **Communications Page** (`/admin/communications`)

#### Recipient Management:
- **View all student emails** in an organized list
- **Quick select groups:**
  - All Students
  - Active Students (confirmed enrollments)
  - Pending Students
- **Individual selection** via checkboxes
- **Copy email addresses** to clipboard for external use
- **Real-time counter** showing selected recipients

#### Email Composer:
- **Subject line** input
- **Message body** text area (plain text, auto-formatted)
- **Preview functionality** before sending
- **Professional email template** with PIN Associate branding

#### Email Preview:
- Shows exactly how email will look to recipients
- Includes branded header, formatted message, CTA button, and footer
- "Back to Edit" option to make changes

### 2. **Professional Email Template**

The system automatically wraps your message in a professional template:

```
┌─────────────────────────────────────────┐
│         [Navy Blue Header]               │
│       PIN Associate Logo/Name            │
│   Professional Institute of Nigeria      │
└─────────────────────────────────────────┘

[Subject Line - Bold, Navy]
From: PIN Associate <admin@pinassociate.org>

[Your Message Content]
(Properly formatted with line breaks)

        [Visit Student Portal Button]
        (Gold CTA button)

─────────────────────────────────────────
PIN Associate - Professional Institute of Nigeria
📧 admin@pinassociate.org | 📱 +234 123 456 7890
© 2024 PIN Associate. All rights reserved.
```

## Usage Guide

### Sending an Email:

**Step 1: Select Recipients**
```
1. Go to /admin/communications
2. Choose recipient group:
   - Click "All Students" for everyone
   - Click "Active Students" for enrolled only
   - Click "Pending Students" for pending enrollments
   - Or manually check individual students
3. See counter update: "15 recipients selected"
```

**Step 2: Compose Message**
```
1. Enter subject line:
   Example: "Upcoming Class Reminder - Python Programming"

2. Write message:
   Example:
   "Dear Students,

   This is a reminder that our Python Programming class is 
   scheduled for tomorrow at 10:00 AM.

   Please ensure you:
   - Have your materials ready
   - Test your Google Meet connection beforehand
   - Submit any pending assignments

   We look forward to seeing you!

   Best regards,
   PIN Associate Team"
```

**Step 3: Preview & Send**
```
1. Click "Preview Email" to see formatted version
2. Review how it will look to recipients
3. If satisfied, click "Send Email"
4. Confirm sending to X recipients
5. Email sent! Form resets automatically
```

### Copy Email Addresses:
```
1. Select desired students
2. Click "Copy Email Addresses" button
3. Paste into external email client (Gmail, Outlook, etc.)
```

## Email Template Structure

### HTML Email Template (Production):

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PIN Associate</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F6; font-family: -apple-system, system-ui, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #1E3A8A 0%, #152D6E 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; font-size: 32px; margin: 0 0 8px 0;">PIN Associate</h1>
        <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">Professional Institute of Nigeria</p>
      </td>
    </tr>
    
    <!-- Subject -->
    <tr>
      <td style="padding: 30px 20px 10px 20px;">
        <h2 style="color: #1E3A8A; font-size: 24px; margin: 0 0 8px 0;">{SUBJECT}</h2>
        <p style="color: #6B6B68; font-size: 12px; margin: 0;">From: PIN Associate &lt;admin@pinassociate.org&gt;</p>
      </td>
    </tr>
    
    <!-- Message Body -->
    <tr>
      <td style="padding: 20px; color: #1C1C1C; font-size: 15px; line-height: 1.6;">
        {MESSAGE_BODY}
      </td>
    </tr>
    
    <!-- CTA Button -->
    <tr>
      <td style="padding: 30px 20px; text-align: center;">
        <a href="{PORTAL_URL}" style="display: inline-block; background-color: #F4C430; color: #152D6E; padding: 14px 32px; text-decoration: none; font-weight: 600; border-radius: 12px;">
          Visit Student Portal
        </a>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="border-top: 1px solid #E4E2DD; padding: 20px; text-align: center; color: #6B6B68; font-size: 12px;">
        <p style="margin: 0 0 8px 0;">PIN Associate - Professional Institute of Nigeria</p>
        <p style="margin: 0 0 8px 0;">📧 admin@pinassociate.org | 📱 +234 123 456 7890</p>
        <p style="margin: 0; font-size: 11px;">© 2024 PIN Associate. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
```

## Integration with Email Service

### Production Implementation:

**Backend API Endpoint:**
```typescript
POST /api/admin/communications/send
Authorization: Bearer {admin_token}

Body:
{
  "recipients": ["student1@example.com", "student2@example.com"],
  "subject": "Upcoming Class Reminder",
  "message": "Dear Students, ...",
  "senderId": "admin_001"
}

Response:
{
  "success": true,
  "emailsSent": 15,
  "failedEmails": [],
  "messageId": "msg_12345"
}
```

### Email Service Providers (Choose One):

#### 1. **SendGrid** (Recommended)
- Free tier: 100 emails/day
- Professional: $19.95/month for 50K emails
- Excellent deliverability
- Email analytics & tracking

```typescript
// Example integration
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: recipients,
  from: 'admin@pinassociate.org',
  subject: subject,
  html: emailTemplate,
};

await sgMail.sendMultiple(msg);
```

#### 2. **Resend** (Modern Alternative)
- Developer-friendly
- React Email templates
- $20/month for 50K emails

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'PIN Associate <admin@pinassociate.org>',
  to: recipients,
  subject: subject,
  html: emailTemplate,
});
```

#### 3. **AWS SES** (Cost-Effective)
- $0.10 per 1,000 emails
- Highly scalable
- Requires AWS account

```typescript
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const client = new SESClient({ region: "us-east-1" });

const command = new SendEmailCommand({
  Source: "admin@pinassociate.org",
  Destination: { ToAddresses: recipients },
  Message: {
    Subject: { Data: subject },
    Body: { Html: { Data: emailTemplate } }
  }
});

await client.send(command);
```

## Email Tracking & Analytics

### Features to Track:
1. **Delivery Rate** - % of emails successfully delivered
2. **Open Rate** - % of emails opened by recipients
3. **Click Rate** - % who clicked "Visit Portal" button
4. **Bounce Rate** - % of emails that bounced
5. **Unsubscribe Rate** - % who opted out

### Analytics Dashboard (Future):
```
📊 Email Campaign Analytics

Emails Sent: 150
Delivered: 147 (98%)
Opened: 98 (66.7%)
Clicked: 45 (30.6%)
Bounced: 3 (2%)
```

## Email Templates Library (Future Enhancement)

### Pre-built Templates:

1. **Class Reminder**
   - Subject: "Class Tomorrow - [Course Name]"
   - Variables: course, date, time, link

2. **Payment Reminder**
   - Subject: "Payment Due - [Amount]"
   - Variables: amount, dueDate, paymentLink

3. **Welcome Email**
   - Subject: "Welcome to PIN Associate!"
   - Variables: studentName, programme

4. **Certificate Ready**
   - Subject: "Your Certificate is Ready!"
   - Variables: studentName, course, downloadLink

5. **General Announcement**
   - Subject: [Custom]
   - Variables: [Custom content]

## Security & Compliance

### Email Best Practices:
1. **SPF Records** - Verify sender domain
2. **DKIM Signing** - Email authentication
3. **Unsubscribe Link** - Required for bulk emails
4. **Rate Limiting** - Max 100 emails per minute
5. **Bounce Handling** - Remove invalid addresses

### Data Privacy:
- Student emails stored securely
- BCC recipients for privacy (don't show all recipients to each other)
- Opt-out mechanism for marketing emails
- GDPR compliance for EU students

## Mock Implementation (Current)

### Current Behavior:
```javascript
// Simulates sending after 2 seconds
setTimeout(() => {
  alert(`Email sent to ${count} recipients!`);
  // Reset form
}, 2000);
```

### Production Behavior:
```javascript
// Makes actual API call
const response = await fetch('/api/admin/communications/send', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ recipients, subject, message })
});

if (response.ok) {
  toast.success(`Email sent to ${count} recipients`);
  // Log to database
  // Track analytics
}
```

## File Structure

```
src/
├── components/admin/
│   ├── AdminCommunicationsContent.tsx  (Main component)
│   └── AdminDashboardLayout.tsx        (Updated with nav link)
├── app/admin/
│   └── communications/
│       └── page.tsx                    (Route)
└── lib/
    └── mockAdminData.ts                (Student data source)
```

## Navigation

The Communications page is accessible from:
- Admin sidebar: "Communications" (Mail icon)
- Direct URL: `/admin/communications`
- Position: Between "Courses" and "Enrollments"

## Future Enhancements

### Phase 1 (Launch):
- ✅ Select recipients
- ✅ Compose message
- ✅ Preview email
- ✅ Professional template
- ✅ Copy emails to clipboard

### Phase 2 (Post-Launch):
- 📧 Integration with email service (SendGrid/Resend)
- 📊 Email analytics dashboard
- 📝 Pre-built template library
- 📅 Schedule emails for later
- 📎 Attach files (PDFs, documents)

### Phase 3 (Advanced):
- 🎯 Segmentation (by programme, performance, location)
- 🤖 Automated emails (triggers on events)
- 📈 A/B testing for subject lines
- 📱 SMS integration for urgent messages
- 🔔 WhatsApp Business API integration

---

**Status:** ✅ **Complete & Ready**  
**Location:** `/admin/communications`  
**Mock Functionality:** ✅ **Working**  
**UI/UX:** ✅ **Professional**  
**Email Template:** ✅ **Branded**

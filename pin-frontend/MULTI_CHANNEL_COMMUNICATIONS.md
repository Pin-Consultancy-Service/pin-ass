# Multi-Channel Communications System

## Overview
Enhanced communications system supporting **Email**, **SMS**, and **WhatsApp** messaging from a single interface.

## ✅ Complete Features

### 1. **Channel Selector Tabs**
Switch between three communication channels:
- 📧 **Email** - Professional branded emails
- 💬 **SMS** - Text messages (160 characters)
- 📱 **WhatsApp** - WhatsApp Business messages

### 2. **Smart Contact Display**
- **Email mode:** Shows student email addresses
- **SMS/WhatsApp mode:** Shows student phone numbers
- Copy to clipboard functionality for each channel

### 3. **Channel-Specific UI**

#### Email Mode:
- Subject line input (required)
- Long message textarea (5000 characters)
- Preview button to see branded template
- Professional email template with logo and footer

#### SMS Mode:
- No subject line (SMS doesn't use subjects)
- Short textarea (160 character limit)
- Character counter with warning at 90%
- Concise messaging guidelines

#### WhatsApp Mode:
- No subject line
- Medium textarea (1000 character limit)
- Character counter
- Emoji support mentioned

## Usage Guide

### Sending an Email:
```
1. Select "Email" tab
2. Choose recipients (shows email addresses)
3. Enter subject line
4. Write message (auto-formatted with branding)
5. Preview or Send
```

### Sending an SMS:
```
1. Select "SMS" tab
2. Choose recipients (shows phone numbers)
3. Write message (max 160 chars)
4. Watch character counter
5. Send SMS
```

### Sending a WhatsApp Message:
```
1. Select "WhatsApp" tab
2. Choose recipients (shows phone numbers)
3. Write message (max 1000 chars)
4. Send WhatsApp
```

## Character Limits

| Channel  | Max Characters | Notes                          |
|----------|----------------|--------------------------------|
| Email    | 5,000          | Wrapped in branded template    |
| SMS      | 160            | Single SMS message             |
| WhatsApp | 1,000          | Longer than SMS, supports emoji|

## Production Integration

### SMS Services (Choose One):

#### 1. **Twilio** (Most Popular)
```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

await client.messages.create({
  body: message,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: recipientPhones
});
```

**Pricing:** $0.0079 per SMS (Nigeria)  
**Features:** Global delivery, two-way messaging, delivery reports

#### 2. **Africa's Talking** (Nigeria-Focused)
```typescript
import AfricasTalking from 'africastalking';

const africastalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

await africastalking.SMS.send({
  to: recipientPhones,
  message: message,
  from: 'PINASSOC' // Sender ID
});
```

**Pricing:** ₦2.5 per SMS (Nigeria)  
**Features:** Bulk SMS, delivery reports, sender ID customization

#### 3. **Termii** (Nigerian Service)
```typescript
await fetch('https://api.ng.termii.com/api/sms/send/bulk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_key: process.env.TERMII_API_KEY,
    to: recipientPhones,
    from: "PINASSOC",
    sms: message,
    type: "plain",
    channel: "generic"
  })
});
```

**Pricing:** ₦2.8 per SMS  
**Features:** Nigerian operator optimized, bulk SMS, OTP

### WhatsApp Business API:

#### **Official WhatsApp Business API** (via Meta)
```typescript
await fetch('https://graph.facebook.com/v18.0/PHONE_NUMBER_ID/messages', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messaging_product: "whatsapp",
    to: recipientPhone,
    type: "text",
    text: { body: message }
  })
});
```

**Requirements:**
- Meta Business account
- WhatsApp Business phone number
- Verified business profile
- Message templates for broadcast (must be pre-approved)

**Pricing:** 
- First 1,000 conversations/month: Free
- After: $0.008 - $0.037 per conversation (Nigeria)

**Message Types:**
- **Template Messages:** Pre-approved, can initiate conversation
- **Session Messages:** Free-form, within 24hr window after user message

#### **Alternative: Twilio for WhatsApp**
```typescript
await client.messages.create({
  from: 'whatsapp:+14155238886', // Twilio sandbox or your number
  to: `whatsapp:${recipientPhone}`,
  body: message
});
```

**Advantages:**
- Easier setup than Meta direct
- Same Twilio account as SMS
- Good for getting started

**Limitations:**
- Costs more than direct Meta API
- Additional layer between you and WhatsApp

## API Endpoints

### Backend Structure:

```typescript
// POST /api/admin/communications/send
interface SendMessageRequest {
  channel: 'email' | 'sms' | 'whatsapp';
  recipients: string[]; // emails or phone numbers
  subject?: string; // email only
  message: string;
  senderId: string;
}

interface SendMessageResponse {
  success: boolean;
  channel: string;
  messagesSent: number;
  failedRecipients: string[];
  messageId: string;
  cost?: number; // SMS/WhatsApp cost in naira
}
```

### Implementation Example:

```typescript
export async function POST(request: Request) {
  const { channel, recipients, subject, message, senderId } = await request.json();
  
  // Validate
  if (!message || recipients.length === 0) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }
  
  let result;
  
  switch (channel) {
    case 'email':
      result = await sendEmails(recipients, subject, message);
      break;
    case 'sms':
      result = await sendSMS(recipients, message);
      break;
    case 'whatsapp':
      result = await sendWhatsApp(recipients, message);
      break;
  }
  
  // Log to database
  await logCommunication({
    channel,
    senderId,
    recipientCount: recipients.length,
    subject,
    message,
    status: result.success ? 'sent' : 'failed',
    cost: result.cost
  });
  
  return Response.json(result);
}
```

## Database Schema

```sql
CREATE TABLE communications_log (
  id VARCHAR PRIMARY KEY,
  channel ENUM('email', 'sms', 'whatsapp') NOT NULL,
  sender_id VARCHAR REFERENCES users(id),
  recipient_count INT NOT NULL,
  subject VARCHAR, -- email only
  message TEXT NOT NULL,
  status ENUM('sent', 'failed', 'partial') NOT NULL,
  cost DECIMAL(10,2), -- in naira
  sent_at TIMESTAMP DEFAULT NOW(),
  failed_recipients JSON -- array of failed contacts
);

-- Track individual message delivery
CREATE TABLE message_delivery (
  id VARCHAR PRIMARY KEY,
  communication_id VARCHAR REFERENCES communications_log(id),
  recipient VARCHAR NOT NULL, -- email or phone
  status ENUM('sent', 'delivered', 'failed', 'read'),
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  error_message VARCHAR
);
```

## Cost Estimation

### Example Monthly Usage:

**Scenario:** 200 students, 4 messages per month

| Channel  | Cost per Message | Messages | Monthly Cost |
|----------|------------------|----------|--------------|
| Email    | Free (SendGrid)  | 800      | ₦0          |
| SMS      | ₦2.5             | 800      | ₦2,000      |
| WhatsApp | ₦3.0 (avg)       | 800      | ₦2,400      |

### Recommendations:

1. **Email:** Free or very cheap - use for newsletters, announcements
2. **SMS:** Use for urgent, time-sensitive messages (class reminders, payment due)
3. **WhatsApp:** Best engagement, use for important updates

## WhatsApp Message Templates

For WhatsApp Business API, you need pre-approved templates:

### Template 1: Class Reminder
```
Hello {{1}},

Your class "{{2}}" is starting {{3}}.

Join here: {{4}}

- PIN Associate Team
```

### Template 2: Payment Reminder
```
Hi {{1}},

Your payment of ₦{{2}} is due on {{3}}.

Pay now: {{4}}

PIN Associate
```

### Template 3: General Update
```
Hello {{1}},

{{2}}

Visit your portal: {{3}}

PIN Associate
```

## Security & Compliance

### Phone Number Validation:
```typescript
import { parsePhoneNumber } from 'libphonenumber-js';

function validateNigerianPhone(phone: string): boolean {
  try {
    const phoneNumber = parsePhoneNumber(phone, 'NG');
    return phoneNumber.isValid();
  } catch {
    return false;
  }
}
```

### Opt-Out Handling:
- Maintain opt-out list for SMS/WhatsApp
- Auto-unsubscribe on "STOP" replies
- Respect "Do Not Disturb" preferences
- GDPR compliance for EU students

### Rate Limiting:
- Max 100 SMS per minute (avoid spam flags)
- Max 100 WhatsApp messages per second
- Queue large batches

## Testing

### Mock Mode (Current):
```javascript
// Simulates 2-second delay, shows success alert
setTimeout(() => {
  alert(`${channel} sent to ${count} recipients`);
}, 2000);
```

### Production Mode:
```javascript
// Makes real API call
const response = await fetch('/api/admin/communications/send', {
  method: 'POST',
  body: JSON.stringify({ channel, recipients, subject, message })
});

if (response.ok) {
  const { messagesSent, cost } = await response.json();
  toast.success(`${channel} sent to ${messagesSent} recipients (₦${cost.toFixed(2)})`);
}
```

## Analytics Dashboard (Future)

Track communication effectiveness:

```
📊 Communications Analytics

Email:
  Sent: 2,450
  Opened: 1,840 (75.1%)
  Clicked: 620 (25.3%)
  
SMS:
  Sent: 850
  Delivered: 847 (99.6%)
  Failed: 3
  Cost: ₦2,125
  
WhatsApp:
  Sent: 650
  Delivered: 648 (99.7%)
  Read: 580 (89.5%)
  Cost: ₦1,950
```

## Best Practices

### When to Use Each Channel:

**Email:**
- ✅ Newsletters and updates
- ✅ Detailed information
- ✅ Attachments (PDFs, certificates)
- ✅ Non-urgent communication

**SMS:**
- ✅ Urgent reminders (class in 30 min)
- ✅ Payment confirmations
- ✅ OTP codes
- ✅ Short, time-sensitive alerts

**WhatsApp:**
- ✅ Class reminders (24hr before)
- ✅ Interactive communication
- ✅ Better engagement than email
- ✅ Students check WhatsApp frequently

### Cost Optimization:

1. **Use Email by default** (free)
2. **SMS for urgent only** (costs add up)
3. **WhatsApp for important** (good engagement, reasonable cost)
4. **Batch messages** (send at scheduled times, not one-by-one)
5. **Clean phone list** (remove inactive numbers)

---

**Status:** ✅ **Complete & Ready**  
**Channels:** 📧 Email | 💬 SMS | 📱 WhatsApp  
**Location:** `/admin/communications`  
**Mock Functionality:** ✅ **Working**  
**Production Ready:** ⚠️ **Needs API integration**

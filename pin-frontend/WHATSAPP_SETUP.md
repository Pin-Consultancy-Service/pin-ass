# WhatsApp Integration Setup Guide

This guide explains how to set up the AI Support Chatbot with WhatsApp integration for PIN Associate.

## Overview

The AI Support Chatbot allows students to send messages through the dashboard, which are automatically forwarded to admin WhatsApp for real-time support.

## Setup Options

### Option 1: WhatsApp Business API (Recommended)

**Requirements:**
- Facebook Business Account
- Verified business phone number
- WhatsApp Business API access

**Steps:**

1. **Create Facebook Business Account**
   - Go to [Facebook Business](https://business.facebook.com)
   - Create or use existing business account
   - Complete business verification

2. **Set up WhatsApp Business API**
   - Go to [Facebook Developers](https://developers.facebook.com)
   - Create new app → Business → WhatsApp
   - Complete setup wizard
   - Add phone number and verify

3. **Get API Credentials**
   - Note your `WhatsApp Business ID`
   - Generate `Access Token` with appropriate permissions
   - Add webhook URL (optional for receiving messages)

4. **Configure Environment Variables**
   ```bash
   WHATSAPP_ACCESS_TOKEN="your-permanent-access-token"
   WHATSAPP_BUSINESS_ID="your-whatsapp-business-id"  
   ADMIN_WHATSAPP_NUMBER="+2348123456789"
   ```

### Option 2: Twilio WhatsApp (Alternative)

**Requirements:**
- Twilio account
- Verified phone number

**Steps:**

1. **Set up Twilio Account**
   - Sign up at [Twilio](https://twilio.com)
   - Get Account SID and Auth Token
   - Enable WhatsApp messaging

2. **Configure Environment Variables**
   ```bash
   TWILIO_ACCOUNT_SID="your-twilio-sid"
   TWILIO_AUTH_TOKEN="your-twilio-token"  
   TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"
   ADMIN_WHATSAPP_NUMBER="+2348123456789"
   ```

### Option 3: Third-Party WhatsApp Services

Other services you can integrate:
- **ChatAPI** - chatapi.com
- **WhatsApp Business Solution Providers**
- **Local WhatsApp Business API providers in Nigeria**

## Environment Configuration

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update with your credentials:**
   ```bash
   # WhatsApp Configuration
   WHATSAPP_ACCESS_TOKEN="EAAxxxxxxxxxxxxx"
   WHATSAPP_BUSINESS_ID="123456789012345"
   ADMIN_WHATSAPP_NUMBER="+2348123456789"
   ```

3. **Test the configuration:**
   ```bash
   npm run dev
   # Visit: http://localhost:3000/api/support/whatsapp
   # Should show configuration status
   ```

## Message Format

Messages sent to admin WhatsApp will include:

```
🎓 NEW SUPPORT REQUEST - PIN Associate

Student: John Doe
Email: john.doe@email.com
Program: ICAN — Professional Level
Student ID: 12345

Message:
I need help with my Financial Accounting assignment. The due date is approaching and I'm having trouble with consolidation entries.

Time: Monday, January 15, 2024 at 2:30:15 PM
Source: Student Dashboard AI Chat

---
Reply to this message to respond to the student.
```

## Features

### For Students:
- ✅ Professional AI chatbot interface
- ✅ Real-time message status (sending, sent, delivered)
- ✅ Typing indicators and bot responses
- ✅ Quick actions (request call, send email)
- ✅ Minimize/maximize chat window
- ✅ Mobile-responsive design

### For Admins:
- ✅ Structured WhatsApp notifications
- ✅ Student information context
- ✅ Time stamped messages
- ✅ Direct reply capability
- ✅ Support request tracking

## Testing

### Development Testing:
```bash
# 1. Start the development server
npm run dev

# 2. Open dashboard and click chat bubble
# 3. Send a test message
# 4. Check console logs for message details
```

### Production Testing:
```bash
# 1. Configure real WhatsApp credentials
# 2. Send test message from student dashboard
# 3. Verify message arrives on admin WhatsApp
# 4. Test reply functionality
```

## Troubleshooting

### Common Issues:

1. **Messages not sending**
   - Check environment variables are set correctly
   - Verify WhatsApp API credentials
   - Check network connectivity
   - Review API rate limits

2. **Invalid phone number format**
   - Use international format: `+2348123456789`
   - Remove spaces and special characters
   - Verify country code

3. **API authentication errors**
   - Regenerate access token
   - Check token permissions
   - Verify business account status

4. **Webhook issues (optional)**
   - Configure HTTPS URL for production
   - Verify webhook token
   - Check endpoint accessibility

### Support Resources:

- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)
- [Twilio WhatsApp API](https://www.twilio.com/whatsapp)
- PIN Associate Tech Support: tech@pinassociate.com

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use strong, unique tokens
   - Rotate access tokens regularly

2. **Data Privacy**
   - Student messages contain personal information
   - Comply with data protection regulations
   - Secure API endpoints

3. **Rate Limiting**
   - Implement message throttling
   - Monitor API usage
   - Set up alerts for unusual activity

## Monitoring & Analytics

### Message Tracking:
- Log all support requests
- Track response times  
- Monitor student satisfaction
- Generate usage reports

### Performance Metrics:
- API response times
- Message delivery rates
- Error rates and types
- Peak usage hours

## Customization

### Modify Bot Responses:
Edit `src/components/ui/AISupportChatbot.tsx`:
```typescript
const botResponses = [
  "Thank you for reaching out! I've received your message...",
  // Add your custom responses
];
```

### Change Styling:
Update CSS variables for brand colors:
```css
:root {
  --navy: #1e3a8a;
  --gold: #d97706;
  /* Customize as needed */
}
```

### Add Features:
- File upload support
- Voice message integration
- Multi-language support
- Chat history persistence

---

**Need Help?**
Contact PIN Associate development team or refer to the API documentation for your chosen WhatsApp service provider.
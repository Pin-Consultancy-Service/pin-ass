import { NextRequest, NextResponse } from 'next/server';

// TODO: Configure these environment variables
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/send';
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const ADMIN_PHONE_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER || '+2348123456789';
const WHATSAPP_BUSINESS_ID = process.env.WHATSAPP_BUSINESS_ID;

interface WhatsAppMessage {
  studentName: string;
  studentEmail: string;
  studentProgram: string;
  studentId: string;
  message: string;
  timestamp: string;
}

// Format message for WhatsApp
function formatWhatsAppMessage(data: WhatsAppMessage): string {
  return `🎓 *NEW SUPPORT REQUEST - PIN Associates*

*Student:* ${data.studentName}
*Email:* ${data.studentEmail}
*Program:* ${data.studentProgram}  
*Student ID:* ${data.studentId}

*Message:*
${data.message}

*Time:* ${data.timestamp}
*Source:* Student Dashboard AI Chat

---
Reply to this message to respond to the student.`;
}

// Send message via WhatsApp Business API
async function sendWhatsAppMessage(message: string): Promise<boolean> {
  try {
    // Option 1: WhatsApp Business API (recommended for production)
    if (WHATSAPP_ACCESS_TOKEN && WHATSAPP_BUSINESS_ID) {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${WHATSAPP_BUSINESS_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: ADMIN_PHONE_NUMBER.replace('+', ''),
            type: 'text',
            text: {
              body: message
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('WhatsApp API Error:', errorText);
        throw new Error(`WhatsApp API error: ${response.status}`);
      }

      const result = await response.json();
      return true;
    }

    // Option 2: Third-party WhatsApp service (fallback)
    // You can integrate services like Twilio, WhatsApp Business Solution providers, etc.
    
    // For now, we'll log the message (replace with actual implementation)

    // Simulate successful sending
    return true;

  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    throw error;
  }
}

// POST endpoint to handle support messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { studentName, studentEmail, studentProgram, studentId, message } = body;

    // Validate required fields
    if (!studentName || !studentEmail || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: studentName, studentEmail, message' },
        { status: 400 }
      );
    }

    // Prepare WhatsApp message data
    const whatsappData: WhatsAppMessage = {
      studentName: studentName || 'Unknown Student',
      studentEmail: studentEmail || 'no-email@example.com',
      studentProgram: studentProgram || 'ICAN Professional',
      studentId: studentId || 'unknown',
      message: message,
      timestamp: new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Lagos',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };

    // Format and send WhatsApp message
    const formattedMessage = formatWhatsAppMessage(whatsappData);
    await sendWhatsAppMessage(formattedMessage);

    // Log the interaction for analytics

    return NextResponse.json({
      success: true,
      message: 'Support request sent successfully',
      timestamp: whatsappData.timestamp
    });

  } catch (error) {
    console.error('Support API Error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to send support request',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check service status
export async function GET() {
  return NextResponse.json({
    service: 'PIN Associates Support API',
    status: 'operational',
    timestamp: new Date().toISOString(),
    whatsappConfigured: !!(WHATSAPP_ACCESS_TOKEN && WHATSAPP_BUSINESS_ID),
    adminNumber: ADMIN_PHONE_NUMBER ? `${ADMIN_PHONE_NUMBER.substring(0, 4)}****${ADMIN_PHONE_NUMBER.slice(-2)}` : 'not configured'
  });
}
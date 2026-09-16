import { NextRequest, NextResponse } from 'next/server';

// TODO: Configure these environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_xxxxxxxxxxxxx';
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxx';

interface PaystackInitializeRequest {
  email: string;
  amount: number;
  currency: string;
  plan_id: string;
  description: string;
  callback_url?: string;
  metadata?: any;
}

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: PaystackInitializeRequest = await request.json();
    
    const { email, amount, currency, plan_id, description } = body;

    // Validate required fields
    if (!email || !amount || !currency || !plan_id) {
      return NextResponse.json(
        { error: 'Missing required fields: email, amount, currency, plan_id' },
        { status: 400 }
      );
    }

    // Generate reference
    const reference = `PIN_${plan_id}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    // Prepare callback URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const callback_url = `${baseUrl}/api/payments/callback`;

    // Initialize payment with Paystack
    const paystackPayload = {
      email,
      amount, // Amount in kobo
      currency,
      reference,
      callback_url,
      metadata: {
        plan_id,
        description,
        student_email: email,
        custom_fields: [
          {
            display_name: "Payment Plan",
            variable_name: "payment_plan",
            value: plan_id
          }
        ]
      }
    };

    console.log('Initializing Paystack payment:', {
      ...paystackPayload,
      amount: `₦${amount / 100}` // Log in readable format
    });

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackPayload)
    });

    if (!paystackResponse.ok) {
      const errorText = await paystackResponse.text();
      console.error('Paystack API Error:', errorText);
      throw new Error(`Paystack API error: ${paystackResponse.status}`);
    }

    const paystackData: PaystackInitializeResponse = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || 'Paystack initialization failed');
    }

    // TODO: Store payment record in database
    console.log('Payment initialized successfully:', {
      reference: paystackData.data.reference,
      authorization_url: paystackData.data.authorization_url
    });

    // Return the authorization URL for redirect
    return NextResponse.json({
      success: true,
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
      access_code: paystackData.data.access_code
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to initialize payment',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check service status
export async function GET() {
  return NextResponse.json({
    service: 'PIN Associate Payment API',
    status: 'operational',
    timestamp: new Date().toISOString(),
    paystack_configured: !!PAYSTACK_SECRET_KEY && !!PAYSTACK_PUBLIC_KEY,
    public_key: PAYSTACK_PUBLIC_KEY ? `${PAYSTACK_PUBLIC_KEY.substring(0, 7)}...` : 'not configured'
  });
}
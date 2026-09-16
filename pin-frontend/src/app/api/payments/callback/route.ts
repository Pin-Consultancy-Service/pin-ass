import { NextRequest, NextResponse } from 'next/server';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_xxxxxxxxxxxxx';

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: {
      plan_id?: string;
      description?: string;
      student_email?: string;
      custom_fields?: any[];
    };
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      phone: string | null;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
    };
  };
}

// Verify payment with Paystack
async function verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Paystack verification error:', errorText);
    throw new Error(`Paystack verification failed: ${response.status}`);
  }

  return await response.json();
}

// Generate receipt PDF
async function generateReceipt(paymentData: any): Promise<string> {
  // TODO: Implement PDF receipt generation
  // For now, return a placeholder URL
  return `/receipts/${paymentData.reference}.pdf`;
}

// GET handler for payment callback
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');
  const status = searchParams.get('status');

  if (!reference) {
    return NextResponse.redirect(
      new URL('/portal/student/fees?error=missing_reference', request.url)
    );
  }

  try {
    // Verify the payment with Paystack
    const verificationResponse = await verifyPayment(reference);

    if (!verificationResponse.status) {
      throw new Error(verificationResponse.message || 'Payment verification failed');
    }

    const paymentData = verificationResponse.data;

    // Check if payment was successful
    if (paymentData.status !== 'success') {
      console.log('Payment not successful:', {
        reference,
        status: paymentData.status,
        message: paymentData.message
      });

      return NextResponse.redirect(
        new URL(`/portal/student/fees?error=payment_failed&reference=${reference}`, request.url)
      );
    }

    // Payment was successful
    console.log('Payment successful:', {
      reference,
      amount: `₦${paymentData.amount / 100}`,
      customer: paymentData.customer.email,
      plan_id: paymentData.metadata.plan_id
    });

    // TODO: Update database with payment record
    const paymentRecord = {
      reference: paymentData.reference,
      amount: paymentData.amount / 100, // Convert from kobo to naira
      status: 'CONFIRMED',
      method: 'Paystack',
      customer_email: paymentData.customer.email,
      plan_id: paymentData.metadata.plan_id,
      description: paymentData.metadata.description,
      paid_at: paymentData.paid_at,
      paystack_id: paymentData.id,
      gateway_response: paymentData.gateway_response,
      channel: paymentData.channel,
      card_info: {
        last4: paymentData.authorization.last4,
        bank: paymentData.authorization.bank,
        card_type: paymentData.authorization.card_type
      }
    };

    // Generate receipt
    const receiptUrl = await generateReceipt(paymentData);

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/portal/student/fees?success=payment_completed&reference=${reference}&amount=${paymentData.amount / 100}`, request.url)
    );

  } catch (error) {
    console.error('Payment callback error:', error);
    
    return NextResponse.redirect(
      new URL(`/portal/student/fees?error=verification_failed&reference=${reference}`, request.url)
    );
  }
}

// POST handler for webhook (for server-to-server notifications)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-paystack-signature');

    // TODO: Verify webhook signature
    // const computedSignature = crypto
    //   .createHmac('sha512', PAYSTACK_SECRET_KEY)
    //   .update(JSON.stringify(body))
    //   .digest('hex');

    if (body.event === 'charge.success') {
      const { data } = body;
      
      console.log('Webhook: Payment successful', {
        reference: data.reference,
        amount: `₦${data.amount / 100}`,
        customer: data.customer.email
      });

      // TODO: Update database with confirmed payment
      // This is the authoritative confirmation of payment
    }

    return NextResponse.json({ status: 'success' });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
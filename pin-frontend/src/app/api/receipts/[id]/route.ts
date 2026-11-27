import { NextRequest, NextResponse } from 'next/server';

// Simple receipt generation (without external PDF libraries)
function generateSimpleReceipt(paymentData: any): string {
  const currentDate = new Date().toLocaleDateString('en-NG');
  const paymentDate = paymentData.paid_at ? new Date(paymentData.paid_at).toLocaleDateString('en-NG') : currentDate;

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Payment Receipt - PIN Associates</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { color: #1e3a8a; font-size: 24px; font-weight: bold; }
        .receipt-title { color: #d97706; font-size: 20px; margin-top: 10px; }
        .receipt-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .receipt-details { background: #f8fafc; padding: 20px; border-radius: 8px; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .amount-section { background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #6b7280; }
        .status-confirmed { color: #059669; font-weight: bold; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">PIN ASSOCIATES</div>
        <div>Professional Institute of Nigeria</div>
        <div class="receipt-title">PAYMENT RECEIPT</div>
    </div>

    <div class="receipt-info">
        <div>
            <strong>Receipt No:</strong> ${paymentData.id || paymentData.reference}<br>
            <strong>Date:</strong> ${paymentDate}
        </div>
        <div>
            <strong>Status:</strong> <span class="status-confirmed">CONFIRMED</span><br>
            <strong>Method:</strong> ${paymentData.method || 'Paystack'}
        </div>
    </div>

    <div class="receipt-details">
        <h3>Student Information</h3>
        <div class="detail-row">
            <span>Name:</span>
            <span>${paymentData.student_name || 'Student'}</span>
        </div>
        <div class="detail-row">
            <span>Email:</span>
            <span>${paymentData.customer_email || paymentData.email}</span>
        </div>
        <div class="detail-row">
            <span>Program:</span>
            <span>ICAN Professional Level</span>
        </div>
    </div>

    <div class="receipt-details">
        <h3>Payment Details</h3>
        <div class="detail-row">
            <span>Description:</span>
            <span>${paymentData.description}</span>
        </div>
        <div class="detail-row">
            <span>Payment Reference:</span>
            <span>${paymentData.reference}</span>
        </div>
        <div class="detail-row">
            <span>Gateway Response:</span>
            <span>${paymentData.gateway_response || 'Successful'}</span>
        </div>
        ${paymentData.card_info ? `
        <div class="detail-row">
            <span>Card:</span>
            <span>****${paymentData.card_info.last4} (${paymentData.card_info.bank})</span>
        </div>` : ''}
    </div>

    <div class="amount-section">
        <h2>Amount Paid</h2>
        <div style="font-size: 36px; font-weight: bold;">₦${paymentData.amount.toLocaleString()}</div>
    </div>

    <div class="footer">
        <p><strong>PIN Associates</strong></p>
        <p>Professional Institute of Nigeria - Excellence in Professional Education</p>
        <p>This is a computer-generated receipt and does not require a signature.</p>
        <p>For inquiries, contact: support@pinassociates.com | +234 (0) 123 456 7890</p>
        <hr>
        <p>Receipt generated on ${currentDate}</p>
    </div>

    <script>
        // Auto-print when opened
        window.onload = function() {
            if (window.location.search.includes('print=true')) {
                window.print();
            }
        }
    </script>
</body>
</html>
  `.trim();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: receiptId } = await params;
    
    // TODO: Fetch payment record from database
    // For now, use mock data
    const mockPaymentData = {
      id: receiptId,
      reference: `PIN_REF_${receiptId}`,
      amount: 150000,
      description: 'ICAN Professional Level - 2nd Installment',
      customer_email: 'student@example.com',
      student_name: 'Demo Student',
      method: 'Paystack',
      status: 'CONFIRMED',
      paid_at: new Date().toISOString(),
      gateway_response: 'Successful',
      card_info: {
        last4: '1234',
        bank: 'GTBank',
        card_type: 'visa'
      }
    };

    // Check if PDF format is requested
    const url = new URL(request.url);
    const format = url.searchParams.get('format');
    
    if (format === 'pdf') {
      // For now, return HTML that can be printed as PDF
      // TODO: Implement proper PDF generation with libraries like puppeteer or jsPDF
      const htmlContent = generateSimpleReceipt(mockPaymentData);
      
      return new NextResponse(htmlContent, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `inline; filename="PIN_Receipt_${receiptId}.html"`,
        },
      });
    }

    // Return JSON receipt data
    return NextResponse.json({
      success: true,
      receipt: mockPaymentData,
      download_url: `/api/receipts/${receiptId}?format=pdf`,
      print_url: `/api/receipts/${receiptId}?format=pdf&print=true`
    });

  } catch (error) {
    console.error('Receipt generation error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to generate receipt',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
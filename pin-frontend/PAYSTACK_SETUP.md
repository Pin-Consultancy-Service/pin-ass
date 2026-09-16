# Paystack Integration Setup Guide - PIN Associate

## 🏦 Overview

This guide explains how to set up the complete Paystack payment system for PIN Associate, including payment processing, receipt generation, and webhook handling.

## 📋 Features Implemented

### **🎯 Student Finance Dashboard**
- ✅ **Financial Overview Cards**: Total fees, paid amount, balance due, receipts count
- ✅ **Outstanding Balance Alerts**: Clear notifications for pending payments
- ✅ **Payment Plans**: Full payment and installment options
- ✅ **One-Click Payments**: Direct integration with Paystack
- ✅ **Payment History**: Filterable transaction history
- ✅ **Receipt Downloads**: PDF receipt generation and download

### **💳 Paystack Integration**
- ✅ **Payment Initialize**: Secure payment initialization API
- ✅ **Payment Callback**: Verification and confirmation handling
- ✅ **Webhook Support**: Real-time payment notifications
- ✅ **Receipt System**: Automated receipt generation
- ✅ **Error Handling**: Comprehensive error management

## 🚀 Setup Instructions

### **Step 1: Paystack Account Setup**

1. **Create Paystack Account**
   - Go to [Paystack.com](https://paystack.com)
   - Sign up with business email
   - Complete business verification process

2. **Get API Keys**
   - Navigate to Settings → API Keys & Webhooks
   - Copy your **Test Public Key** (starts with `pk_test_`)
   - Copy your **Test Secret Key** (starts with `sk_test_`)
   - For production: Use live keys (`pk_live_` and `sk_live_`)

3. **Configure Webhook**
   - In Paystack Dashboard → Settings → API Keys & Webhooks
   - Add webhook URL: `https://your-domain.com/api/payments/callback`
   - Select events: `charge.success`, `charge.dispute.create`

### **Step 2: Environment Configuration**

Create `.env.local` file with your Paystack credentials:

```bash
# Paystack Configuration
PAYSTACK_SECRET_KEY="sk_test_your_secret_key_here"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_your_public_key_here"  
PAYSTACK_WEBHOOK_SECRET="your_webhook_secret"

# Application URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
# For production: NEXT_PUBLIC_BASE_URL="https://your-domain.com"
```

### **Step 3: Test the Integration**

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Navigate to Finance Page**
   ```
   http://localhost:3000/portal/student/fees
   ```

3. **Test Payment Flow**
   - Click "Pay Now" on any payment plan
   - Use Paystack test cards:
     - **Success**: 4084084084084081
     - **Declined**: 4084084084084081 (with wrong CVV)
     - **Insufficient Funds**: 4111111111111112

4. **Verify Integration**
   - Check payment initialization: `/api/payments/initialize`  
   - Check callback handling: `/api/payments/callback`
   - Check receipt generation: `/api/receipts/[id]`

## 💡 Payment Flow Explained

### **🔄 Complete Payment Process**

```
1. Student clicks "Pay Now" 
   ↓
2. Frontend calls /api/payments/initialize
   ↓
3. Backend creates Paystack transaction
   ↓
4. Student redirected to Paystack payment page
   ↓
5. Student completes payment
   ↓
6. Paystack redirects to /api/payments/callback
   ↓
7. Backend verifies payment with Paystack
   ↓
8. Payment record saved to database
   ↓ 
9. Receipt generated and available for download
   ↓
10. Student redirected back to finance page with success message
```

### **📊 API Endpoints**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/payments/initialize` | POST | Initialize Paystack payment |
| `/api/payments/callback` | GET | Handle payment callback/verification |
| `/api/payments/callback` | POST | Handle Paystack webhooks |
| `/api/receipts/[id]` | GET | Generate and download receipts |

## 🎨 UI Components

### **💰 Finance Dashboard Layout**

```
┌─────────────────────────────────────────────────────────┐
│                    Finance & Payments                   │
├─────────────────────────────────────────────────────────┤
│  💰 Total Fees   ✅ Paid      ⚠️ Balance   🧾 Receipts   │
│     ₦450,000      ₦150,000     ₦300,000         2       │
├─────────────────────────────────────────────────────────┤
│  ⚠️ Outstanding Balance: ₦300,000                       │
├─────────────────────────────────────────────────────────┤
│                    Payment Plans                        │
│  📚 ICAN Professional - Full Payment    [💳 Pay Now]    │
│  📚 ICAN Professional - 1st Install.   ✅ PAID         │
│  📚 ICAN Professional - 2nd Install.    [💳 Pay Now]    │
├─────────────────────────────────────────────────────────┤
│                   Payment History                       │
│  📄 1st Installment  ✅ CONFIRMED  ₦150,000  📥Receipt  │  
│  📄 Registration Fee  ⏳ PENDING   ₦25,000             │
└─────────────────────────────────────────────────────────┘
```

### **🎯 Payment Plans Features**

```typescript
interface PaymentPlan {
  id: string;                    // Unique plan identifier
  name: string;                  // Display name
  amount: string;                // Amount in Naira
  description: string;           // Plan description  
  due_date: string;             // Payment due date
  is_paid: boolean;             // Payment status
  installments?: number;        // Number of installments
}
```

### **📄 Receipt System**

- **Professional Design**: PIN Associate branding and layout
- **Complete Information**: Student details, payment info, amount
- **PDF Generation**: Downloadable PDF receipts
- **Print Support**: Print-friendly formatting
- **Reference Numbers**: Paystack reference tracking

## 🔒 Security Features

### **🛡️ Payment Security**
- ✅ **HTTPS Only**: All payment communication encrypted
- ✅ **Server-Side Verification**: Payments verified with Paystack API
- ✅ **Webhook Validation**: Cryptographic signature verification
- ✅ **No Card Storage**: No sensitive card data stored locally
- ✅ **Reference Tracking**: Unique payment references prevent duplication

### **📊 Error Handling**
```typescript
// Payment failures gracefully handled
try {
  const response = await initializePayment(plan);
  if (response.authorization_url) {
    window.location.href = response.authorization_url;
  }
} catch (error) {
  showError('Payment initialization failed. Please try again.');
}
```

## 🧪 Testing Scenarios

### **✅ Test Cases**

1. **Successful Payment**
   - Use test card: 4084084084084081
   - Verify callback receives success status  
   - Confirm payment record created
   - Check receipt generation

2. **Failed Payment**
   - Use declined test card
   - Verify proper error handling
   - Confirm no payment record created
   - Check error message display

3. **Webhook Testing**
   - Use Paystack webhook simulator
   - Verify webhook signature validation
   - Test duplicate webhook prevention
   - Confirm payment status updates

4. **Receipt Generation**
   - Test PDF receipt creation
   - Verify download functionality
   - Check print formatting
   - Validate receipt content accuracy

## 📈 Production Deployment

### **🚀 Go-Live Checklist**

- [ ] **Switch to Live Keys**: Replace test keys with live Paystack keys
- [ ] **Update Webhook URLs**: Point to production callback endpoints  
- [ ] **SSL Certificate**: Ensure HTTPS for all payment pages
- [ ] **Database Setup**: Configure production database for payment records
- [ ] **Error Monitoring**: Set up logging and error tracking
- [ ] **Backup System**: Implement payment data backup
- [ ] **Testing**: Complete end-to-end testing in production environment

### **🔧 Production Environment Variables**

```bash
# Production Paystack Keys
PAYSTACK_SECRET_KEY="sk_live_your_live_secret_key"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_live_your_live_public_key"

# Production URLs
NEXT_PUBLIC_BASE_URL="https://portal.pinassociate.com"

# Database
DATABASE_URL="postgresql://user:pass@prod-db:5432/pinassociate"

# Environment
NODE_ENV="production"
```

## 🎯 Customization Options

### **💰 Payment Plans Configuration**

```typescript
// Easy to modify payment structures
const paymentPlans = [
  {
    id: "full_payment",
    name: "ICAN Professional Level - Full Payment", 
    amount: "450000", // ₦450,000
    description: "Complete course fee with 10% discount",
    discount: true
  },
  {
    id: "installment_1", 
    name: "1st Installment (of 3)",
    amount: "150000", // ₦150,000
    installments: 3,
    due_date: "2024-01-15"
  }
];
```

### **🎨 UI Customization**

```css
/* Easy theme customization */
:root {
  --navy: #1e3a8a;           /* Primary color */
  --gold: #d97706;           /* Accent color */ 
  --success: #059669;        /* Success states */
  --warning: #F59E0B;        /* Warning states */
  --error: #DC2626;          /* Error states */
}
```

## 📞 Support & Troubleshooting

### **🆘 Common Issues**

1. **Payment Initialization Fails**
   - Check Paystack API keys are correct
   - Verify network connectivity
   - Check request payload format

2. **Callback Not Receiving**
   - Confirm webhook URL is accessible
   - Check HTTPS configuration
   - Verify firewall settings

3. **Receipt Generation Issues**
   - Check payment record exists in database
   - Verify PDF generation dependencies
   - Test download endpoint directly

### **📋 Debug Information**

```typescript
// Enable debug logging
console.log('Paystack Config:', {
  publicKey: PAYSTACK_PUBLIC_KEY?.substring(0, 10) + '...',
  hasSecretKey: !!PAYSTACK_SECRET_KEY,
  webhookUrl: `${baseUrl}/api/payments/callback`
});
```

### **📞 Support Contacts**

- **Paystack Support**: support@paystack.com
- **PIN Associate Tech**: tech@pinassociate.com
- **Documentation**: [Paystack Docs](https://paystack.com/docs)

---

## ✅ **Implementation Status**

**Phase 1: Core Payment System** ✅ **COMPLETE**
- [x] Paystack payment initialization
- [x] Payment verification and callbacks  
- [x] Receipt generation and downloads
- [x] Enhanced finance dashboard UI
- [x] Error handling and security

**Phase 2: Advanced Features** 🚀 **READY FOR DEVELOPMENT**
- [ ] Automatic payment reminders
- [ ] Installment payment scheduling
- [ ] Payment analytics dashboard  
- [ ] Bulk payment processing
- [ ] Mobile payment optimization

The Paystack payment system is now fully integrated and ready for testing! Students can make secure payments and receive professional receipts automatically. 🎉
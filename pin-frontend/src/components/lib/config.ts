/**
 * Central site configuration.
 * Update values here — they propagate everywhere automatically.
 */
export const SITE_CONFIG = {
  /** WhatsApp number in international format (no +, no spaces) */
  whatsappNumber: "2348000000000",

  /**
   * WhatsApp group invite link.
   * TODO: Replace with PIN Associate's actual WhatsApp group link once supplied.
   * Format: https://chat.whatsapp.com/XXXXXXXXXXXXXXXXXXXXXX
   * Until confirmed, falls back to the direct number link below.
   */
  whatsappGroupLink: "", // ← [PLACEHOLDER — to be supplied by PIN Associate]

  /** Pre-filled WhatsApp greeting message (used for direct number link) */
  whatsappMessage:
    "Hello PIN Associate! I found your website and would like to learn more about your services.",

  /** Resolved WhatsApp deep-link: group invite if available, else direct number */
  get whatsappUrl(): string {
    if (this.whatsappGroupLink) return this.whatsappGroupLink;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(
      this.whatsappMessage
    )}`;
  },

  /** Portal/auth paths where floating widgets are hidden */
  hiddenWidgetPaths: ["/portal", "/admin-portal", "/admin", "/instructor"],

  /**
   * Paystack public key.
   * Set NEXT_PUBLIC_PAYSTACK_KEY in .env.local for the frontend.
   * Use test key (pk_test_…) for development, live key (pk_live_…) for production.
   * TODO: Replace with PIN Associate's Paystack public key once supplied.
   */
  paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY ?? "",

  /** Site contact details — update when confirmed by PIN Associate */
  contact: {
    phone: "+234 800 000 0000",          // [PLACEHOLDER]
    email: "info@pinassociates.com.ng",  // [PLACEHOLDER]
    address: "Lagos, Nigeria",           // [PLACEHOLDER — full address to be supplied]
    hours: "Mon–Fri: 8am–6pm · Sat: 9am–3pm",
  },

  /**
   * Bank account details for manual transfer payments.
   * TODO: Replace all [PLACEHOLDER] values with actual account details from PIN Associate.
   */
  bankAccounts: {
    student: {
      bankName: "[BANK NAME — TO BE SUPPLIED]",
      accountName: "PIN Associate",
      accountNumber: "[ACCOUNT NUMBER — TO BE SUPPLIED]",
      sortCode: "",
    },
    client: {
      bankName: "[BANK NAME — TO BE SUPPLIED]",
      accountName: "PIN Associate",
      accountNumber: "[ACCOUNT NUMBER — TO BE SUPPLIED]",
      sortCode: "",
    },
    training: {
      bankName: "[BANK NAME — TO BE SUPPLIED]",
      accountName: "PIN Associate",
      accountNumber: "[ACCOUNT NUMBER — TO BE SUPPLIED]",
      sortCode: "",
    },
  },
};

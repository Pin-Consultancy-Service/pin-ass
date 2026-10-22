"use client";

import { Mail, Phone, MessageCircle, FileQuestion, Clock, MapPin, Send } from "lucide-react";
import { useState } from "react";

export default function StudentSupportContent() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual support ticket submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSubject("");
      setMessage("");
    }, 3000);
  };

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
        >
          Help & Support
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          We're here to help! Get in touch with our support team or find answers to common questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Contact Cards */}
        <a
          href="mailto:info@pinassociates.com.ng"
          className="p-6 rounded-2xl border transition-all hover:shadow-lg hover:scale-[1.02] group"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: 'var(--navy-50)' }}
          >
            <Mail className="w-6 h-6" style={{ color: 'var(--navy)' }} />
          </div>
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ink)' }}>
            Email Support
          </h3>
          <p className="text-sm mb-3" style={{ color: 'var(--ink-muted)' }}>
            Send us an email and we'll respond within 24 hours
          </p>
          <p className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>
            info@pinassociates.com.ng
          </p>
        </a>

        <a
          href="tel:+2348012345678"
          className="p-6 rounded-2xl border transition-all hover:shadow-lg hover:scale-[1.02] group"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: '#DCFCE7' }}
          >
            <Phone className="w-6 h-6" style={{ color: '#16A34A' }} />
          </div>
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ink)' }}>
            Phone Support
          </h3>
          <p className="text-sm mb-3" style={{ color: 'var(--ink-muted)' }}>
            Call us during business hours for immediate assistance
          </p>
          <p className="text-sm font-semibold" style={{ color: '#16A34A' }}>
            +234 801 234 5678
          </p>
        </a>

        <button
          onClick={() => {
            // WhatsApp link
            window.open('https://wa.me/2348012345678', '_blank');
          }}
          className="p-6 rounded-2xl border transition-all hover:shadow-lg hover:scale-[1.02] group text-left"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: '#D1FAE5' }}
          >
            <MessageCircle className="w-6 h-6" style={{ color: '#059669' }} />
          </div>
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ink)' }}>
            WhatsApp
          </h3>
          <p className="text-sm mb-3" style={{ color: 'var(--ink-muted)' }}>
            Chat with us on WhatsApp for quick responses
          </p>
          <p className="text-sm font-semibold" style={{ color: '#059669' }}>
            Start Chat →
          </p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Form */}
        <div 
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <h2 className="font-bold text-xl mb-4" style={{ color: 'var(--ink)' }}>
            Send Us a Message
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="subject" className="form-label">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help you?"
                required
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question in detail..."
                required
                rows={6}
                className="form-input resize-none"
              />
            </div>

            {submitted && (
              <div 
                className="p-4 rounded-xl border-l-4"
                style={{ backgroundColor: '#DCFCE7', borderColor: '#16A34A' }}
              >
                <p className="text-sm font-semibold" style={{ color: '#16A34A' }}>
                  ✓ Message sent! We'll get back to you soon.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitted}
              className="w-full py-3 px-6 rounded-xl font-semibold transition-all hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="space-y-6">
          {/* Office Hours */}
          <div 
            className="p-6 rounded-2xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--gold-50)' }}
              >
                <Clock className="w-5 h-5" style={{ color: 'var(--gold-dark)' }} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ink)' }}>
                  Office Hours
                </h3>
                <div className="space-y-1 text-sm" style={{ color: 'var(--ink-muted)' }}>
                  <p><strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM</p>
                  <p><strong>Saturday:</strong> 9:00 AM - 3:00 PM</p>
                  <p><strong>Sunday:</strong> Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Office Location */}
          <div 
            className="p-6 rounded-2xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#DBEAFE' }}
              >
                <MapPin className="w-5 h-5" style={{ color: '#2563EB' }} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ink)' }}>
                  Visit Our Office
                </h3>
                <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                  PIN Associate Training Centre<br />
                  123 Business District<br />
                  Lagos, Nigeria
                </p>
              </div>
            </div>
          </div>

          {/* FAQs Link */}
          <div 
            className="p-6 rounded-2xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#F3E8FF' }}
              >
                <FileQuestion className="w-5 h-5" style={{ color: '#9333EA' }} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ink)' }}>
                  Frequently Asked Questions
                </h3>
                <p className="text-sm mb-3" style={{ color: 'var(--ink-muted)' }}>
                  Find quick answers to common questions about courses, payments, and more.
                </p>
                <a
                  href="/#faq"
                  className="text-sm font-semibold inline-flex items-center gap-1 hover:underline"
                  style={{ color: 'var(--navy)' }}
                >
                  View FAQs →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Topics */}
      <div className="mt-8">
        <h2 className="font-bold text-xl mb-4" style={{ color: 'var(--ink)' }}>
          Common Support Topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Account & Login Issues", desc: "Reset password, update profile" },
            { title: "Course Materials", desc: "Access study materials, download files" },
            { title: "Payment & Fees", desc: "Make payments, view receipts" },
            { title: "Class Schedule", desc: "View timetable, join online classes" },
            { title: "Exam & Results", desc: "Check exam dates, view scores" },
            { title: "Technical Support", desc: "Platform issues, browser support" },
          ].map((topic, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)' }}
            >
              <h3 className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                {topic.title}
              </h3>
              <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                {topic.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

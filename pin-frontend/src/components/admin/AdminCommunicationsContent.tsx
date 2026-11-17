"use client";

import { useState } from "react";
import { Mail, Users, Send, Eye, Copy, Check, MessageSquare, Phone } from "lucide-react";
import { mockSystemUsers, mockEnrollments } from "@/lib/mockAdminData";

type ChannelType = 'email' | 'sms' | 'whatsapp';

export default function AdminCommunicationsContent() {
  const [channel, setChannel] = useState<ChannelType>('email');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copiedContacts, setCopiedContacts] = useState(false);

  // Get all students
  const students = mockSystemUsers.filter(user => user.role === 'student');
  
  // Get all unique contacts based on channel
  const getContactString = () => {
    const selected = students.filter(s => selectedRecipients.includes(s.id));
    if (channel === 'email') {
      return selected.map(s => s.email).join(', ');
    } else {
      return selected.map(s => s.phone_number).join(', ');
    }
  };

  // Character limit based on channel
  const maxCharacters = channel === 'sms' ? 160 : channel === 'whatsapp' ? 1000 : 5000;
  const characterCount = message.length;

  // Quick select groups
  const allStudentIds = students.map(s => s.id);
  const activeStudentIds = mockEnrollments
    .filter(e => e.status === 'confirmed')
    .map(e => e.studentId);
  const pendingStudentIds = mockEnrollments
    .filter(e => e.status === 'pending')
    .map(e => e.studentId);

  const handleSelectAll = () => {
    setSelectedRecipients(allStudentIds);
  };

  const handleSelectActive = () => {
    setSelectedRecipients(activeStudentIds);
  };

  const handleSelectPending = () => {
    setSelectedRecipients(pendingStudentIds);
  };

  const handleToggleStudent = (studentId: string) => {
    if (selectedRecipients.includes(studentId)) {
      setSelectedRecipients(selectedRecipients.filter(id => id !== studentId));
    } else {
      setSelectedRecipients([...selectedRecipients, studentId]);
    }
  };

  const handleCopyContacts = () => {
    const contactString = getContactString();
    navigator.clipboard.writeText(contactString);
    setCopiedContacts(true);
    setTimeout(() => setCopiedContacts(false), 2000);
  };

  const handleChannelChange = (newChannel: ChannelType) => {
    setChannel(newChannel);
    setShowPreview(false);
    // Keep recipients and message, but clear subject for SMS/WhatsApp
    if (newChannel !== 'email') {
      setSubject('');
    }
  };

  const handleSend = () => {
    setIsSending(true);
    
    // Simulate sending
    setTimeout(() => {
      const count = selectedRecipients.length;
      const channelName = channel === 'email' ? 'Email' : channel === 'sms' ? 'SMS' : 'WhatsApp message';
      alert(`${channelName} sent successfully to ${count} recipient${count !== 1 ? 's' : ''}!\n\n(This is a mock demo - in production, messages would be sent via ${channel.toUpperCase()} service)`);
      setIsSending(false);
      // Reset form
      setSelectedRecipients([]);
      setSubject("");
      setMessage("");
      setShowPreview(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
          Communications
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Send emails, SMS, and WhatsApp messages to students
        </p>
      </div>

      {/* Channel Selector */}
      <div 
        className="p-2 rounded-xl inline-flex gap-2"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--rule)' }}
      >
        <button
          onClick={() => handleChannelChange('email')}
          className="px-6 py-3 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all"
          style={{
            backgroundColor: channel === 'email' ? 'var(--navy)' : 'transparent',
            color: channel === 'email' ? 'white' : 'var(--ink)',
          }}
        >
          <Mail className="w-4 h-4" />
          Email
        </button>
        <button
          onClick={() => handleChannelChange('sms')}
          className="px-6 py-3 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all"
          style={{
            backgroundColor: channel === 'sms' ? 'var(--navy)' : 'transparent',
            color: channel === 'sms' ? 'white' : 'var(--ink)',
          }}
        >
          <MessageSquare className="w-4 h-4" />
          SMS
        </button>
        <button
          onClick={() => handleChannelChange('whatsapp')}
          className="px-6 py-3 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all"
          style={{
            backgroundColor: channel === 'whatsapp' ? 'var(--navy)' : 'transparent',
            color: channel === 'whatsapp' ? 'white' : 'var(--ink)',
          }}
        >
          <Phone className="w-4 h-4" />
          WhatsApp
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recipients */}
        <div className="lg:col-span-1">
          <div 
            className="p-6 rounded-2xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" style={{ color: 'var(--ink)' }} />
              <h2 className="text-lg font-bold" style={{ color: 'var(--ink)' }}>
                Recipients
              </h2>
            </div>

            {/* Channel Info */}
            <div 
              className="p-3 rounded-lg mb-4"
              style={{ backgroundColor: 'rgba(30, 64, 175, 0.15)', border: '1px solid var(--navy)' }}
            >
              <p className="text-xs font-medium" style={{ color: 'var(--ink)' }}>
                {channel === 'email' && '📧 Sending via Email'}
                {channel === 'sms' && '💬 Sending via SMS'}
                {channel === 'whatsapp' && '📱 Sending via WhatsApp'}
              </p>
            </div>

            {/* Quick Select Buttons */}
            <div className="space-y-2 mb-4">
              <button
                onClick={handleSelectAll}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
                style={{
                  backgroundColor: selectedRecipients.length === allStudentIds.length ? 'var(--navy)' : 'var(--bg)',
                  color: selectedRecipients.length === allStudentIds.length ? 'white' : 'var(--ink)',
                  border: '1px solid var(--rule)',
                }}
              >
                All Students ({allStudentIds.length})
              </button>
              <button
                onClick={handleSelectActive}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
                style={{
                  backgroundColor: 'var(--bg)',
                  color: 'var(--ink)',
                  border: '1px solid var(--rule)',
                }}
              >
                Active Students ({activeStudentIds.length})
              </button>
              <button
                onClick={handleSelectPending}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
                style={{
                  backgroundColor: 'var(--bg)',
                  color: 'var(--ink)',
                  border: '1px solid var(--rule)',
                }}
              >
                Pending Students ({pendingStudentIds.length})
              </button>
            </div>

            {/* Selected Count */}
            <div 
              className="p-3 rounded-lg mb-4"
              style={{ backgroundColor: 'rgba(30, 64, 175, 0.15)', border: '1px solid var(--navy)' }}
            >
              <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                {selectedRecipients.length} recipient{selectedRecipients.length !== 1 ? 's' : ''} selected
              </p>
            </div>

            {/* Copy Contacts Button */}
            {selectedRecipients.length > 0 && (
              <button
                onClick={handleCopyContacts}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 mb-4"
                style={{
                  backgroundColor: copiedContacts ? 'var(--navy)' : 'var(--bg)',
                  color: copiedContacts ? 'white' : 'var(--ink)',
                  border: '1px solid var(--rule)',
                }}
              >
                {copiedContacts ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy {channel === 'email' ? 'Emails' : 'Phone Numbers'}
                  </>
                )}
              </button>
            )}

            {/* Student List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {students.map((student) => (
                <label
                  key={student.id}
                  className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-opacity-50"
                  style={{
                    backgroundColor: selectedRecipients.includes(student.id) ? 'var(--navy-50)' : 'var(--bg)',
                    border: `1px solid ${selectedRecipients.includes(student.id) ? 'var(--navy)' : 'var(--rule)'}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedRecipients.includes(student.id)}
                    onChange={() => handleToggleStudent(student.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: 'var(--ink)' }}>
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--ink-muted)' }}>
                      {channel === 'email' ? student.email : student.phone_number}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Compose Email */}
        <div className="lg:col-span-2">
          <div 
            className="p-6 rounded-2xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <div className="flex items-center gap-2 mb-6">
              {channel === 'email' && <Mail className="w-5 h-5" style={{ color: 'var(--ink)' }} />}
              {channel === 'sms' && <MessageSquare className="w-5 h-5" style={{ color: 'var(--ink)' }} />}
              {channel === 'whatsapp' && <Phone className="w-5 h-5" style={{ color: 'var(--ink)' }} />}
              <h2 className="text-lg font-bold" style={{ color: 'var(--ink)' }}>
                Compose Message
              </h2>
            </div>

            {!showPreview ? (
              <div className="space-y-4">
                {/* Subject (Email only) */}
                {channel === 'email' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Upcoming Class Reminder - ICAN"
                      className="w-full px-4 py-3 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--bg)',
                        borderColor: 'var(--rule)',
                        color: 'var(--ink)',
                      }}
                    />
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                    Message *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      channel === 'email' 
                        ? "Write your message here... (This will be wrapped in a professional email template)"
                        : channel === 'sms'
                        ? "Write your SMS message... (Keep it concise, max 160 characters)"
                        : "Write your WhatsApp message... (max 1000 characters)"
                    }
                    rows={channel === 'email' ? 12 : 6}
                    maxLength={maxCharacters}
                    className="w-full px-4 py-3 rounded-lg border resize-none"
                    style={{
                      backgroundColor: 'var(--bg)',
                      borderColor: 'var(--rule)',
                      color: 'var(--ink)',
                    }}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                      {channel === 'email' && '💡 Your message will be automatically formatted with PIN Associate branding'}
                      {channel === 'sms' && '💡 SMS messages are limited to 160 characters'}
                      {channel === 'whatsapp' && '💡 WhatsApp messages support longer text and emojis'}
                    </p>
                    <p className="text-xs font-medium" style={{ 
                      color: characterCount > maxCharacters * 0.9 ? 'var(--error-text)' : 'var(--ink-muted)' 
                    }}>
                      {characterCount} / {maxCharacters}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {channel === 'email' && (
                    <button
                      onClick={() => setShowPreview(true)}
                      disabled={!subject || !message || selectedRecipients.length === 0}
                      className="flex-1 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      style={{
                        backgroundColor: 'var(--bg)',
                        color: 'var(--ink)',
                        border: '1px solid var(--rule)',
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      Preview Email
                    </button>
                  )}
                  <button
                    onClick={handleSend}
                    disabled={
                      (channel === 'email' && (!subject || !message)) ||
                      (channel !== 'email' && !message) ||
                      selectedRecipients.length === 0 ||
                      isSending
                    }
                    className="flex-1 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    style={{ backgroundColor: 'var(--navy)', color: 'white' }}
                  >
                    {isSending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send {channel === 'email' ? 'Email' : channel === 'sms' ? 'SMS' : 'WhatsApp'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Email Preview */}
                <div 
                  className="rounded-lg border p-6"
                  style={{
                    backgroundColor: 'var(--bg)',
                    borderColor: 'var(--rule)',
                    maxHeight: '600px',
                    overflowY: 'auto',
                  }}
                >
                  {/* Email Header */}
                  <div 
                    className="text-center py-8 mb-6"
                    style={{
                      background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 100%)',
                      margin: '-24px -24px 24px -24px',
                      borderRadius: '8px 8px 0 0',
                    }}
                  >
                    <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                      PIN Associate
                    </h1>
                    <p className="text-white opacity-90 text-sm">
                      Professional Institute of Nigeria
                    </p>
                  </div>

                  {/* Subject */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                      {subject}
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                      From: PIN Associate &lt;admin@pinassociate.org&gt;
                    </p>
                  </div>

                  {/* Message Body */}
                  <div 
                    className="mb-6 whitespace-pre-wrap"
                    style={{ color: 'var(--ink)', lineHeight: '1.6', fontSize: '15px' }}
                  >
                    {message}
                  </div>

                  {/* Call to Action */}
                  <div className="text-center my-8">
                    <a
                      href="#"
                      className="inline-block px-8 py-3 rounded-xl font-semibold"
                      style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-dark)', textDecoration: 'none' }}
                    >
                      Visit Student Portal
                    </a>
                  </div>

                  {/* Footer */}
                  <div 
                    className="pt-6 mt-6 text-center text-sm"
                    style={{
                      borderTop: '1px solid var(--rule)',
                      color: 'var(--ink-muted)',
                    }}
                  >
                    <p className="mb-2" style={{ color: 'var(--ink)' }}>
                      PIN Associate - Professional Institute of Nigeria
                    </p>
                    <p className="mb-2" style={{ color: 'var(--ink-muted)' }}>
                      📧 admin@pinassociate.org | 📱 +234 123 456 7890
                    </p>
                    <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>
                      © 2024 PIN Associate. All rights reserved.
                    </p>
                  </div>
                </div>

                {/* Back Button */}
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-full px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    backgroundColor: 'var(--bg)',
                    color: 'var(--ink)',
                    border: '1px solid var(--rule)',
                  }}
                >
                  ← Back to Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, Bell, Eye, EyeOff, Save, CheckCircle2 } from "lucide-react";

export default function InstructorSettingsContent() {
  const [instructor, setInstructor] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [classReminders, setClassReminders] = useState(true);
  const [studentMessages, setStudentMessages] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const instructorData = localStorage.getItem('instructor_user');
    if (instructorData) {
      const data = JSON.parse(instructorData);
      setInstructor(data);
      setFirstName(data.first_name || '');
      setLastName(data.last_name || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
    }
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update localStorage
    const updatedInstructor = {
      ...instructor,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
    };
    localStorage.setItem('instructor_user', JSON.stringify(updatedInstructor));
    setInstructor(updatedInstructor);
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaving(false);
    setSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
        >
          Settings
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <div 
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--navy-50)' }}
            >
              <User className="w-5 h-5" style={{ color: 'var(--navy)' }} />
            </div>
            <h2 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
              Profile Information
            </h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                placeholder="+2349099861253"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: 'var(--navy)', color: 'white' }}
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              {saved && (
                <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                  <CheckCircle2 className="w-4 h-4" /> Saved
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div 
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--gold-50)' }}
            >
              <Lock className="w-5 h-5" style={{ color: 'var(--gold-dark)' }} />
            </div>
            <h2 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
              Change Password
            </h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="form-input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--ink-faint)' }}
                >
                  {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                id="newPassword"
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-md disabled:opacity-50"
              style={{ backgroundColor: 'var(--gold)', color: 'white' }}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Notification Preferences */}
        <div 
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#DBEAFE' }}
            >
              <Bell className="w-5 h-5" style={{ color: '#2563EB' }} />
            </div>
            <h2 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors hover:bg-opacity-50" style={{ backgroundColor: 'var(--bg)' }}>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--ink)' }}>
                  Email Notifications
                </p>
                <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                  Receive email updates about your classes and students
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-5 h-5 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors hover:bg-opacity-50" style={{ backgroundColor: 'var(--bg)' }}>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--ink)' }}>
                  Class Reminders
                </p>
                <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                  Get reminded before your scheduled classes
                </p>
              </div>
              <input
                type="checkbox"
                checked={classReminders}
                onChange={(e) => setClassReminders(e.target.checked)}
                className="w-5 h-5 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors hover:bg-opacity-50" style={{ backgroundColor: 'var(--bg)' }}>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--ink)' }}>
                  Student Messages
                </p>
                <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                  Receive notifications when students send you messages
                </p>
              </div>
              <input
                type="checkbox"
                checked={studentMessages}
                onChange={(e) => setStudentMessages(e.target.checked)}
                className="w-5 h-5 rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

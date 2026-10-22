"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";

export default function AdminSettingsContent() {
  const [activeTab, setActiveTab] = useState<'general' | 'email' | 'security' | 'backup'>('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
          System Settings
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Configure system preferences and settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'general', label: 'General' },
          { key: 'email', label: 'Email' },
          { key: 'security', label: 'Security' },
          { key: 'backup', label: 'Backup' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className="px-6 py-3 rounded-lg font-medium text-sm transition-all whitespace-nowrap"
            style={{
              backgroundColor: activeTab === tab.key ? 'var(--navy)' : 'var(--surface)',
              color: activeTab === tab.key ? 'white' : 'var(--ink-muted)',
              border: `1px solid ${activeTab === tab.key ? 'var(--navy)' : 'var(--rule)'}`
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div 
          className="p-6 rounded-xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            General Settings
          </h3>

          <div className="space-y-6">
            <div>
              <label className="form-label">System Name</label>
              <input 
                type="text" 
                className="form-input"
                defaultValue="PIN Associate"
              />
            </div>

            <div>
              <label className="form-label">Timezone</label>
              <select className="form-input">
                <option>Africa/Lagos (WAT)</option>
                <option>Africa/Abuja (WAT)</option>
                <option>UTC</option>
              </select>
            </div>

            <div>
              <label className="form-label">Currency</label>
              <select className="form-input">
                <option value="NGN">Nigerian Naira (NGN)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Fiscal Year Start</label>
              <select className="form-input">
                <option>January</option>
                <option>April</option>
                <option>July</option>
                <option>October</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
              style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-dark)' }}
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5" />
                  Saved Successfully
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Email Settings */}
      {activeTab === 'email' && (
        <div 
          className="p-6 rounded-xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Email Configuration
          </h3>

          <div className="space-y-6">
            <div>
              <label className="form-label">SMTP Host</label>
              <input 
                type="text" 
                className="form-input"
                defaultValue="smtp.pinassociate.com"
                disabled
              />
            </div>

            <div>
              <label className="form-label">SMTP Port</label>
              <input 
                type="number" 
                className="form-input"
                defaultValue="587"
                disabled
              />
            </div>

            <div>
              <label className="form-label">SMTP Username</label>
              <input 
                type="text" 
                className="form-input"
                defaultValue="noreply@pinassociate.com"
                disabled
              />
            </div>

            <div>
              <label className="form-label">SMTP Password</label>
              <input 
                type="password" 
                className="form-input"
                defaultValue="••••••••••••"
                disabled
              />
            </div>

            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: '#FEF3C7', color: '#92600A' }}
            >
              <p className="text-sm">
                <strong>Note:</strong> Contact your system administrator to update SMTP settings.
              </p>
            </div>

            <button
              className="px-6 py-3 rounded-xl font-semibold"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
            >
              Test Email
            </button>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div 
          className="p-6 rounded-xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Security Settings
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3" style={{ color: 'var(--ink)' }}>Password Requirements</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm" style={{ color: 'var(--ink)' }}>Require uppercase letters</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm" style={{ color: 'var(--ink)' }}>Require numbers</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm" style={{ color: 'var(--ink)' }}>Require special characters</span>
                </label>
              </div>
            </div>

            <div>
              <label className="form-label">Session Timeout (minutes)</label>
              <input 
                type="number" 
                className="form-input"
                defaultValue="30"
                min="5"
                max="120"
              />
            </div>

            <div>
              <h4 className="font-semibold mb-3" style={{ color: 'var(--ink)' }}>Two-Factor Authentication</h4>
              <div className="flex items-center gap-3">
                <label className="relative inline-block w-14 h-8">
                  <input type="checkbox" className="sr-only peer" />
                  <div 
                    className="w-full h-full rounded-full transition-colors peer-checked:bg-navy"
                    style={{ backgroundColor: 'var(--rule)' }}
                  ></div>
                  <div 
                    className="absolute left-1 top-1 w-6 h-6 rounded-full bg-white transition-transform peer-checked:translate-x-6"
                  ></div>
                </label>
                <span className="text-sm" style={{ color: 'var(--ink)' }}>Enable 2FA for all admin accounts</span>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
              style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-dark)' }}
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5" />
                  Saved Successfully
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Backup Settings */}
      {activeTab === 'backup' && (
        <div 
          className="p-6 rounded-xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Backup & Recovery
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--ink)' }}>Last Backup</h4>
              <p className="text-sm mb-4" style={{ color: 'var(--ink-muted)' }}>
                July 14, 2024 at 02:00 AM (Automatic backup)
              </p>
              <button
                className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                style={{ backgroundColor: 'var(--navy)', color: 'white' }}
              >
                <Download className="w-5 h-5" />
                Download Database Backup
              </button>
            </div>

            <div className="border-t pt-6" style={{ borderColor: 'var(--rule)' }}>
              <h4 className="font-semibold mb-3" style={{ color: 'var(--ink)' }}>Automatic Backups</h4>
              <div className="flex items-center gap-3 mb-4">
                <label className="relative inline-block w-14 h-8">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div 
                    className="w-full h-full rounded-full transition-colors peer-checked:bg-navy"
                    style={{ backgroundColor: 'var(--rule)' }}
                  ></div>
                  <div 
                    className="absolute left-1 top-1 w-6 h-6 rounded-full bg-white transition-transform peer-checked:translate-x-6"
                  ></div>
                </label>
                <span className="text-sm" style={{ color: 'var(--ink)' }}>Schedule automatic backups</span>
              </div>

              <label className="form-label">Backup Frequency</label>
              <select className="form-input">
                <option>Daily (recommended)</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
              style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-dark)' }}
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5" />
                  Saved Successfully
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

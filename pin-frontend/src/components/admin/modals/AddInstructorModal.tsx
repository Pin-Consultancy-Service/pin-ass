"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddInstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddInstructorModal({ isOpen, onClose, onSuccess }: AddInstructorModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, make API call here
    onSuccess();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg rounded-2xl p-6"
        style={{ backgroundColor: 'var(--surface)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Add New Instructor
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-opacity-80" style={{ backgroundColor: 'var(--bg)' }}>
            <X className="w-5 h-5" style={{ color: 'var(--ink)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
              Specialization
            </label>
            <select
              required
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
            >
              <option value="">Select Specialization</option>
              <option value="Financial Accounting & IFRS">Financial Accounting & IFRS</option>
              <option value="Taxation & Management">Taxation & Management</option>
              <option value="Auditing & Corporate Finance">Auditing & Corporate Finance</option>
              <option value="Corporate Finance & Risk Management">Corporate Finance & Risk Management</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl font-semibold"
              style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--rule)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-xl font-semibold"
              style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-dark)' }}
            >
              Add Instructor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

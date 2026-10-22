"use client";

import { useState } from "react";
import BaseModal from "./BaseModal";

interface AddInstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddInstructorModal({ isOpen, onClose, onSuccess }: AddInstructorModalProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    specialization: '',
    bio: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
      onClose();
    }, 1000);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Instructor"
      size="md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-semibold text-sm"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--ink-muted)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl font-semibold text-sm"
            style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-dark)' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Instructor'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              First Name *
            </label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: errors.first_name ? '#DC2626' : 'var(--rule)',
                color: 'var(--ink)'
              }}
            />
            {errors.first_name && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.first_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              Last Name *
            </label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: errors.last_name ? '#DC2626' : 'var(--rule)',
                color: 'var(--ink)'
              }}
            />
            {errors.last_name && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.last_name}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border"
            style={{ 
              backgroundColor: 'var(--surface)', 
              borderColor: errors.email ? '#DC2626' : 'var(--rule)',
              color: 'var(--ink)'
            }}
          />
          {errors.email && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
            Phone Number
          </label>
          <input
            type="text"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
            Specialization *
          </label>
          <input
            type="text"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border"
            style={{ 
              backgroundColor: 'var(--surface)', 
              borderColor: errors.specialization ? '#DC2626' : 'var(--rule)',
              color: 'var(--ink)'
            }}
            placeholder="e.g., Financial Accounting"
          />
          {errors.specialization && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.specialization}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
            rows={4}
            placeholder="Brief professional biography..."
          />
        </div>
      </form>
    </BaseModal>
  );
}

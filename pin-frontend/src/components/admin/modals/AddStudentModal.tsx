"use client";

import { useState } from "react";
import BaseModal from "./BaseModal";
import { mockCourses } from "@/lib/mockAdminData";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddStudentModal({ isOpen, onClose, onSuccess }: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    programme: '',
    paymentStatus: 'unpaid',
    amountPaid: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.programme) newErrors.programme = 'Programme is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Randomly succeed or fail for demonstration
          // In production, this would be an actual API call
          const success = true; // Math.random() > 0.1;
          if (success) {
            resolve(true);
          } else {
            reject(new Error('Failed to add student. Please try again.'));
          }
        }, 1000);
      });
      
      onSuccess();
      handleClose();
    } catch (error: any) {
      setSubmitError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      programme: '',
      paymentStatus: 'unpaid',
      amountPaid: 0,
    });
    setErrors({});
    setSubmitError(null);
    onClose();
  };

  const programmes = Array.from(new Set(mockCourses.map(c => c.programme)));

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Student"
      size="md"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--ink-muted)' }}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
            style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-dark)' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Student'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div 
            className="p-3 rounded-xl border"
            style={{ 
              backgroundColor: '#FEF2F2', 
              borderColor: '#FEE2E2',
              color: '#DC2626'
            }}
          >
            <p className="text-sm font-medium">{submitError}</p>
          </div>
        )}
        
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
              placeholder="John"
            />
            {errors.first_name && (
              <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.first_name}</p>
            )}
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
              placeholder="Doe"
            />
            {errors.last_name && (
              <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.last_name}</p>
            )}
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
            placeholder="john.doe@email.com"
          />
          {errors.email && (
            <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.email}</p>
          )}
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
            style={{ 
              backgroundColor: 'var(--surface)', 
              borderColor: 'var(--rule)',
              color: 'var(--ink)'
            }}
            placeholder="+234 803 456 7890"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
            Programme *
          </label>
          <select
            value={formData.programme}
            onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border"
            style={{ 
              backgroundColor: 'var(--surface)', 
              borderColor: errors.programme ? '#DC2626' : 'var(--rule)',
              color: 'var(--ink)'
            }}
          >
            <option value="">Select programme</option>
            {programmes.map((prog) => (
              <option key={prog} value={prog}>{prog}</option>
            ))}
          </select>
          {errors.programme && (
            <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.programme}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              Payment Status
            </label>
            <select
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: 'var(--rule)',
                color: 'var(--ink)'
              }}
            >
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              Amount Paid (₦)
            </label>
            <input
              type="number"
              value={formData.amountPaid}
              onChange={(e) => setFormData({ ...formData, amountPaid: Number(e.target.value) })}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: 'var(--rule)',
                color: 'var(--ink)'
              }}
              placeholder="0"
              min="0"
            />
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

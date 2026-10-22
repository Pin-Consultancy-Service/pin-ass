"use client";

import { useState } from "react";
import BaseModal from "./BaseModal";
import { mockCourses, mockSystemUsers } from "@/lib/mockAdminData";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateClassModal({ isOpen, onClose, onSuccess }: CreateClassModalProps) {
  const [formData, setFormData] = useState({
    courseId: '',
    instructorId: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    type: 'in-person',
    capacity: 50,
    onlineLink: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const instructors = mockSystemUsers.filter(u => u.role === 'instructor');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (!formData.instructorId) newErrors.instructorId = 'Instructor is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.venue) newErrors.venue = 'Venue is required';

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
          const success = true;
          if (success) {
            resolve(true);
          } else {
            reject(new Error('Failed to create class. Please try again.'));
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
      courseId: '',
      instructorId: '',
      date: '',
      startTime: '',
      endTime: '',
      venue: '',
      type: 'in-person',
      capacity: 50,
      onlineLink: '',
    });
    setErrors({});
    setSubmitError(null);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Class"
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
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
            {isSubmitting ? 'Creating...' : 'Create Class'}
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
              Course *
            </label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: errors.courseId ? '#DC2626' : 'var(--rule)',
                color: 'var(--ink)'
              }}
            >
              <option value="">Select course</option>
              {mockCourses.map((course) => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
            {errors.courseId && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.courseId}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              Instructor *
            </label>
            <select
              value={formData.instructorId}
              onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: errors.instructorId ? '#DC2626' : 'var(--rule)',
                color: 'var(--ink)'
              }}
            >
              <option value="">Select instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.first_name} {instructor.last_name}
                </option>
              ))}
            </select>
            {errors.instructorId && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.instructorId}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: errors.date ? '#DC2626' : 'var(--rule)',
                color: 'var(--ink)'
              }}
            />
            {errors.date && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              Start Time *
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: errors.startTime ? '#DC2626' : 'var(--rule)',
                color: 'var(--ink)'
              }}
            />
            {errors.startTime && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.startTime}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              End Time *
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: errors.endTime ? '#DC2626' : 'var(--rule)',
                color: 'var(--ink)'
              }}
            />
            {errors.endTime && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.endTime}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
            Venue *
          </label>
          <input
            type="text"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border"
            style={{ 
              backgroundColor: 'var(--surface)', 
              borderColor: errors.venue ? '#DC2626' : 'var(--rule)',
              color: 'var(--ink)'
            }}
            placeholder="PIN Training Centre, Lagos"
          />
          {errors.venue && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.venue}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              Class Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
            >
              <option value="in-person">In-Person</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              Capacity
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
              min="1"
              max="100"
            />
          </div>
        </div>

        {(formData.type === 'online' || formData.type === 'hybrid') && (
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              Online Meeting Link
            </label>
            <input
              type="url"
              value={formData.onlineLink}
              onChange={(e) => setFormData({ ...formData, onlineLink: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
              placeholder="https://meet.google.com/..."
            />
          </div>
        )}
      </form>
    </BaseModal>
  );
}

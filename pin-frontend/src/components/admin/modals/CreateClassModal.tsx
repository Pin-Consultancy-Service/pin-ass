"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateClassModal({ isOpen, onClose, onSuccess }: CreateClassModalProps) {
  const [formData, setFormData] = useState({
    courseName: "",
    instructorId: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    capacity: "",
    type: "in-person",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, make API call here
    console.log("Creating class:", formData);
    onSuccess();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--surface)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Schedule New Class
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-opacity-80" style={{ backgroundColor: 'var(--bg)' }}>
            <X className="w-5 h-5" style={{ color: 'var(--ink)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
              Course Name
            </label>
            <input
              type="text"
              required
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
              Instructor
            </label>
            <select
              required
              value={formData.instructorId}
              onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
            >
              <option value="">Select Instructor</option>
              <option value="INS001">Dr. Adewale Thompson</option>
              <option value="INS002">Mrs. Chioma Okafor</option>
              <option value="INS003">Mr. Yusuf Ibrahim</option>
              <option value="INS004">Ms. Funmilayo Adebayo</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
                Start Time
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
                End Time
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
              Class Type
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
            >
              <option value="in-person">In-Person</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
              Venue
            </label>
            <input
              type="text"
              required
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder={formData.type === 'online' ? 'Zoom/Google Meet Link' : 'Physical Location'}
              className="w-full px-4 py-2 rounded-lg border"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
              Maximum Capacity
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
            />
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
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

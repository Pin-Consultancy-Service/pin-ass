"use client";

import { useState } from "react";
import { X, FileText, Download } from "lucide-react";

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GenerateReportModal({ isOpen, onClose }: GenerateReportModalProps) {
  const [reportType, setReportType] = useState<'enrollment' | 'revenue' | 'performance' | 'attendance'>('enrollment');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '3m' | '6m' | '1y'>('30d');
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      // In a real app, this would trigger a download
      const reportName = `${reportType}-report-${dateRange}.${format}`;
      alert(`Report generated successfully!\n\nFile: ${reportName}\n\n(This is a mock demo - in production, the file would be downloaded)`);
      setIsGenerating(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="w-full max-w-2xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--rule)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
            >
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>
              Generate Report
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            style={{ color: 'var(--ink-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              Report Type *
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="form-input w-full"
              style={{
                padding: '0.75rem',
                border: '1px solid var(--rule)',
                borderRadius: '0.75rem',
                backgroundColor: 'var(--surface)',
                color: 'var(--ink)',
              }}
            >
              <option value="enrollment">Enrollment Report</option>
              <option value="revenue">Revenue & Finance Report</option>
              <option value="performance">Student Performance Report</option>
              <option value="attendance">Attendance Report</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              Date Range *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { value: '7d', label: 'Last 7 Days' },
                { value: '30d', label: 'Last 30 Days' },
                { value: '3m', label: 'Last 3 Months' },
                { value: '6m', label: 'Last 6 Months' },
                { value: '1y', label: 'Last Year' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDateRange(option.value as any)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: dateRange === option.value ? 'var(--navy)' : 'var(--surface)',
                    color: dateRange === option.value ? 'white' : 'var(--ink)',
                    border: `1px solid ${dateRange === option.value ? 'var(--navy)' : 'var(--rule)'}`,
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              Export Format *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'pdf', label: 'PDF' },
                { value: 'excel', label: 'Excel' },
                { value: 'csv', label: 'CSV' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormat(option.value as any)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                  style={{
                    backgroundColor: format === option.value ? 'var(--navy)' : 'var(--surface)',
                    color: format === option.value ? 'white' : 'var(--ink)',
                    border: `1px solid ${format === option.value ? 'var(--navy)' : 'var(--rule)'}`,
                  }}
                >
                  <FileText className="w-6 h-6" />
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Report Preview Info */}
          <div 
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'var(--navy-50)', border: '1px solid var(--navy)' }}
          >
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--navy)' }}>
              Report Summary
            </p>
            <div className="text-sm space-y-1" style={{ color: 'var(--ink-muted)' }}>
              <p>• Type: <span className="font-medium" style={{ color: 'var(--ink)' }}>
                {reportType === 'enrollment' && 'Enrollment Report'}
                {reportType === 'revenue' && 'Revenue & Finance Report'}
                {reportType === 'performance' && 'Student Performance Report'}
                {reportType === 'attendance' && 'Attendance Report'}
              </span></p>
              <p>• Period: <span className="font-medium" style={{ color: 'var(--ink)' }}>
                {dateRange === '7d' && 'Last 7 Days'}
                {dateRange === '30d' && 'Last 30 Days'}
                {dateRange === '3m' && 'Last 3 Months'}
                {dateRange === '6m' && 'Last 6 Months'}
                {dateRange === '1y' && 'Last Year'}
              </span></p>
              <p>• Format: <span className="font-medium" style={{ color: 'var(--ink)' }}>
                {format.toUpperCase()}
              </span></p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all"
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--ink)',
                border: '1px solid var(--rule)',
              }}
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

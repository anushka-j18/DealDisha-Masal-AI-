'use client';

import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Building2, DollarSign, Clock, MessageSquare, Loader2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { LeadIntakeInput } from '@/lib/types';

interface LeadIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: LeadIntakeInput) => Promise<void>;
  isSubmitting: boolean;
}

const ANALYSIS_STEPS = [
  'Analyzing lead...',
  'Understanding customer intent',
  'Extracting key requirements',
  'Identifying concerns & objections',
  'Preparing signature Next Move',
];

const DEMO_PRESETS: { label: string; data: LeadIntakeInput }[] = [
  {
    label: 'Bangalore 2BHK ₹80L',
    data: {
      customerName: 'Rahul Sharma',
      location: 'Whitefield, Bangalore',
      propertyRequirement: '2BHK apartment near Whitefield',
      budget: '₹80 Lakhs',
      buyingTimeline: 'Within 1 month',
      customerMessage: 'Looking for a 2BHK for my family near Whitefield. My budget is around 80L. We are planning to buy soon. Prefer something close to metro and schools.',
    },
  },
  {
    label: 'Mumbai Luxury 3BHK ₹2.2Cr',
    data: {
      customerName: 'Priya Shah',
      location: 'Powai, Mumbai',
      propertyRequirement: '3BHK luxury apartment in Powai',
      budget: '₹2.2 Crores',
      buyingTimeline: '1-3 months',
      customerMessage: 'We are expanding our search for a spacious 3BHK in Powai West. Budget up to 2.2Cr. Need a gated community with clubhouse and security.',
    },
  },
  {
    label: 'Hyderabad Villa ₹3.5Cr',
    data: {
      customerName: 'Ananya Roy',
      location: 'Tellapur, Hyderabad',
      propertyRequirement: '4BHK gated villa',
      budget: '₹3.5 Crores',
      buyingTimeline: 'Within 1 month',
      customerMessage: 'Urgent inquiry: Relocating to Hyderabad next month. Need a 4BHK gated villa in Tellapur area. Budget 3.5Cr max. Need immediate possession.',
    },
  },
];

export const LeadIntakeModal: React.FC<LeadIntakeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<LeadIntakeInput>({
    customerName: '',
    location: '',
    propertyRequirement: '',
    budget: '',
    buyingTimeline: 'Within 1 month',
    customerMessage: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSubmitting) {
      setCurrentStepIndex(0);
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.propertyRequirement.trim()) {
      newErrors.propertyRequirement = 'Property requirement is required';
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required';
    }

    if (!formData.customerMessage.trim()) {
      newErrors.customerMessage = 'Customer message is required';
    } else if (formData.customerMessage.trim().length < 10) {
      newErrors.customerMessage = 'Message should contain at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError(null);
  };

  const handleSelectPreset = (preset: LeadIntakeInput) => {
    setFormData(preset);
    setErrors({});
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      setFormData({
        customerName: '',
        location: '',
        propertyRequirement: '',
        budget: '',
        buyingTimeline: 'Within 1 month',
        customerMessage: '',
      });
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit lead.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add Inbound Opportunity</h2>
            <p className="text-xs text-slate-500 font-medium">
              Create a lead record for AI intent analysis &amp; Next Move calculation.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Error Banner */}
        {submitError && (
          <div className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Quick Presets */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Quick Demo Fill:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {DEMO_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSelectPreset(preset.data)}
                className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Structured Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SECTION 1: CUSTOMER */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1">
              CUSTOMER
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full rounded-md border px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
                    errors.customerName ? 'border-rose-500' : 'border-slate-200 focus:border-indigo-600'
                  }`}
                />
                {errors.customerName && <p className="text-[10px] text-rose-600 mt-0.5 font-medium">{errors.customerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g. Whitefield, Bangalore"
                  className={`w-full rounded-md border px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
                    errors.location ? 'border-rose-500' : 'border-slate-200 focus:border-indigo-600'
                  }`}
                />
                {errors.location && <p className="text-[10px] text-rose-600 mt-0.5 font-medium">{errors.location}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 2: PROPERTY */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1">
              PROPERTY
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Requirement *
                </label>
                <input
                  type="text"
                  name="propertyRequirement"
                  value={formData.propertyRequirement}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g. 2BHK apartment near metro"
                  className={`w-full rounded-md border px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
                    errors.propertyRequirement ? 'border-rose-500' : 'border-slate-200 focus:border-indigo-600'
                  }`}
                />
                {errors.propertyRequirement && <p className="text-[10px] text-rose-600 mt-0.5 font-medium">{errors.propertyRequirement}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Budget *
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g. ₹80 Lakhs"
                  className={`w-full rounded-md border px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
                    errors.budget ? 'border-rose-500' : 'border-slate-200 focus:border-indigo-600'
                  }`}
                />
                {errors.budget && <p className="text-[10px] text-rose-600 mt-0.5 font-medium">{errors.budget}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 3: TIMELINE */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1">
              TIMELINE
            </span>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Buying Timeline *
              </label>
              <select
                name="buyingTimeline"
                value={formData.buyingTimeline}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
              >
                <option value="Within 1 month">Within 1 month (Immediate Purchase)</option>
                <option value="1-3 months">1 to 3 months (Active Comparison)</option>
                <option value="3-6 months">3 to 6 months (Planning Phase)</option>
                <option value="6+ months">6+ months (Exploratory)</option>
              </select>
            </div>
          </div>

          {/* SECTION 4: CONVERSATION */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1">
              CONVERSATION
            </span>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Message / Inquiry *
              </label>
              <textarea
                name="customerMessage"
                rows={3}
                value={formData.customerMessage}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Paste WhatsApp message, web inquiry, or phone notes..."
                className={`w-full rounded-md border px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors resize-none ${
                  errors.customerMessage ? 'border-rose-500' : 'border-slate-200 focus:border-indigo-600'
                }`}
              />
              {errors.customerMessage && <p className="text-[10px] text-rose-600 mt-0.5 font-medium">{errors.customerMessage}</p>}
            </div>
          </div>

          {/* Step Progress Treatment while AI is analyzing */}
          {isSubmitting && (
            <div className="rounded-md bg-indigo-50 border border-indigo-100 p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                <span>{ANALYSIS_STEPS[currentStepIndex]}</span>
              </div>
              <div className="w-full bg-indigo-200 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Bottom Submit Action */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze Lead</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

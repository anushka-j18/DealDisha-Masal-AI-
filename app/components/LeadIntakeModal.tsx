'use client';

import React, { useState } from 'react';
import { X, Sparkles, User, MapPin, Building, DollarSign, Clock, MessageSquare, Loader2, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LeadIntakeInput } from '@/lib/types';

interface LeadIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: LeadIntakeInput) => Promise<void>;
  isSubmitting: boolean;
}

const DEMO_PRESETS: { label: string; data: LeadIntakeInput }[] = [
  {
    label: '⚡ Bangalore 2BHK ₹80L (Urgent)',
    data: {
      customerName: 'Rahul Sharma',
      location: 'Bangalore',
      propertyRequirement: '2BHK apartment near Whitefield',
      budget: '₹80 Lakhs',
      buyingTimeline: 'Within 1 month',
      customerMessage: 'Looking for a 2BHK for my family near Whitefield. My budget is around 80L. We are planning to buy soon. Prefer something close to metro and schools.',
    },
  },
  {
    label: '✨ Mumbai Luxury 3BHK ₹2.2Cr',
    data: {
      customerName: 'Priya Shah',
      location: 'Mumbai',
      propertyRequirement: '3BHK luxury apartment in Powai / Kanjurmarg',
      budget: '₹2.2 Crores',
      buyingTimeline: '1-3 months',
      customerMessage: 'We are expanding our search for a spacious 3BHK in Powai or Kanjurmarg West. Budget up to 2.2Cr. Need a gated community with clubhouse and security. Buying in 1 to 3 months.',
    },
  },
  {
    label: '🏡 Hyderabad Villa Relocation ₹3.5Cr',
    data: {
      customerName: 'Ananya Roy',
      location: 'Hyderabad',
      propertyRequirement: 'Gated community villa in Gachibowli / Tellapur',
      budget: '₹3.5 Crores',
      buyingTimeline: 'Within 1 month',
      customerMessage: 'Urgent inquiry: Relocating to Hyderabad next month. Need a 4BHK gated villa in Tellapur or Gachibowli area. Budget 3.5Cr max. Need immediate possession.',
    },
  },
  {
    label: '📈 Gurgaon Plot Investment ₹1.5Cr',
    data: {
      customerName: 'Aman Verma',
      location: 'Gurgaon',
      propertyRequirement: 'Residential plot / villa in Sector 57 or 65',
      budget: '₹1.5 Crores',
      buyingTimeline: '3-6 months',
      customerMessage: 'Hi, I am looking to invest in a residential plot or independent villa floor along Golf Course Extension Road (Sec 57/65). Budget around 1.5Cr. Planning in 3 to 6 months.',
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
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Customer name must be at least 2 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Target location is required';
    }

    if (!formData.propertyRequirement.trim()) {
      newErrors.propertyRequirement = 'Property requirement is required';
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required';
    }

    if (!formData.buyingTimeline) {
      newErrors.buyingTimeline = 'Buying timeline selection is required';
    }

    if (!formData.customerMessage.trim()) {
      newErrors.customerMessage = 'Customer message / inquiry text is required';
    } else if (formData.customerMessage.trim().length < 10) {
      newErrors.customerMessage = 'Customer message should contain at least 10 characters for AI analysis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific field error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setSubmitError(null);
  };

  const handleSelectPreset = (preset: LeadIntakeInput) => {
    setFormData(preset);
    setErrors({});
    setSubmitError(null);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          customerName: '',
          location: '',
          propertyRequirement: '',
          budget: '',
          buyingTimeline: 'Within 1 month',
          customerMessage: '',
        });
      }, 1000);
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit lead. Please check network connection.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add Inbound Property Lead</h2>
              <p className="text-xs text-slate-400">
                AI will immediately analyze intent, score urgency, and generate your Next Move.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Error Banner */}
        {submitError && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Success Alert */}
        {submitSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Lead successfully submitted and analyzed! Loading workspace...</span>
          </div>
        )}

        {/* Quick Demo Presets */}
        <div className="mt-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            Quick Demo Presets:
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {DEMO_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.data)}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-950/30 hover:text-indigo-200 transition-all disabled:opacity-50"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lead Intake Form */}
        <form onSubmit={handleSubmitForm} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-slate-400" /> Customer Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g. Rahul Sharma"
                className={`w-full rounded-lg border bg-slate-950 px-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                  errors.customerName
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {errors.customerName && (
                <p className="mt-1 text-[11px] font-medium text-rose-400">{errors.customerName}</p>
              )}
            </div>

            {/* Target Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" /> Target Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g. Whitefield, Bangalore"
                className={`w-full rounded-lg border bg-slate-950 px-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                  errors.location
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {errors.location && (
                <p className="mt-1 text-[11px] font-medium text-rose-400">{errors.location}</p>
              )}
            </div>

            {/* Property Requirement */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Building className="h-3.5 w-3.5 text-slate-400" /> Property Requirement *
              </label>
              <input
                type="text"
                name="propertyRequirement"
                value={formData.propertyRequirement}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g. 2BHK apartment near Whitefield"
                className={`w-full rounded-lg border bg-slate-950 px-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                  errors.propertyRequirement
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {errors.propertyRequirement && (
                <p className="mt-1 text-[11px] font-medium text-rose-400">{errors.propertyRequirement}</p>
              )}
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-slate-400" /> Budget *
              </label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g. ₹80 Lakhs"
                className={`w-full rounded-lg border bg-slate-950 px-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                  errors.budget
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {errors.budget && (
                <p className="mt-1 text-[11px] font-medium text-rose-400">{errors.budget}</p>
              )}
            </div>
          </div>

          {/* Buying Timeline */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" /> Buying Timeline *
            </label>
            <select
              name="buyingTimeline"
              value={formData.buyingTimeline}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Within 1 month">Within 1 month (Immediate Purchase Intent)</option>
              <option value="1-3 months">1 to 3 months (Active Comparison)</option>
              <option value="3-6 months">3 to 6 months (Exploratory Phase)</option>
              <option value="6+ months">6+ months / Future Planning</option>
            </select>
          </div>

          {/* Customer Message / Inquiry */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5 text-slate-400" /> Customer Message / Inquiry *
            </label>
            <textarea
              name="customerMessage"
              rows={4}
              value={formData.customerMessage}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Paste exact WhatsApp inquiry, web lead message, or phone notes..."
              className={`w-full rounded-lg border bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors resize-none ${
                errors.customerMessage
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.customerMessage && (
              <p className="mt-1 text-[11px] font-medium text-rose-400">{errors.customerMessage}</p>
            )}
          </div>

          {/* Submit Controls */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-400 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze & Save Lead</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

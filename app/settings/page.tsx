'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { User, Mail, Sliders, CheckCircle2, ArrowUpDown, Filter } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
}

export default function SettingsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Preference states (stored in localStorage)
  const [defaultSort, setDefaultSort] = useState<string>('score_desc');
  const [defaultView, setDefaultView] = useState<string>('ALL');
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        setLoading(true);
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUserData(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch user session:', err);
      } finally {
        setLoading(false);
      }
    }

    // Load saved preferences
    if (typeof window !== 'undefined') {
      const savedSort = localStorage.getItem('dealdisha_default_sort');
      const savedView = localStorage.getItem('dealdisha_default_view');
      if (savedSort) setDefaultSort(savedSort);
      if (savedView) setDefaultView(savedView);
    }

    fetchMe();
  }, []);

  const handleSortChange = (value: string) => {
    setDefaultSort(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dealdisha_default_sort', value);
    }
    showSavedNotification();
  };

  const handleViewChange = (value: string) => {
    setDefaultView(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dealdisha_default_view', value);
    }
    showSavedNotification();
  };

  const showSavedNotification = () => {
    setSavedMessage('Preferences updated');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar
        currentTab="overview"
        onTabChange={() => {}}
        onOpenIntakeModal={() => {}}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Settings" subtitle="Manage your account and workspace preferences" />

        <main className="p-6 max-w-4xl w-full mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-900">Settings</span>
          </div>

          {/* Toast Notification */}
          {savedMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{savedMessage}</span>
            </div>
          )}

          {/* Account Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <User className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Account</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Name</span>
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-600" />
                  {loading ? 'Loading...' : userData?.name || 'Sales Professional'}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Email</span>
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-indigo-600" />
                  {loading ? 'Loading...' : userData?.email || 'user@dealdisha.com'}
                </span>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <Sliders className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Preferences</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
              {/* Default Lead Sorting */}
              <div className="space-y-2">
                <label htmlFor="default-sorting-select" className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <ArrowUpDown className="h-3.5 w-3.5 text-indigo-600" />
                  Default Lead Sorting
                </label>
                <select
                  id="default-sorting-select"
                  value={defaultSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all cursor-pointer"
                >
                  <option value="score_desc">Highest AI Score</option>
                  <option value="score_asc">Lowest AI Score</option>
                  <option value="date_newest">Newest First</option>
                  <option value="date_oldest">Oldest First</option>
                </select>
                <p className="text-[11px] text-slate-500">Choose how lead opportunities are sorted by default in your pipeline.</p>
              </div>

              {/* Default Lead View */}
              <div className="space-y-2">
                <label htmlFor="default-view-select" className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Filter className="h-3.5 w-3.5 text-indigo-600" />
                  Default Lead View
                </label>
                <select
                  id="default-view-select"
                  value={defaultView}
                  onChange={(e) => handleViewChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all cursor-pointer"
                >
                  <option value="ALL">All Leads</option>
                  <option value="HOT">Hot Priority Only</option>
                  <option value="WARM">Warm Priority Only</option>
                  <option value="COLD">Cold Priority Only</option>
                </select>
                <p className="text-[11px] text-slate-500">Select the default pipeline filter applied when opening your dashboard.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}


'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Key,
  CheckCircle2,
  Building2,
  Edit3,
  Check,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface UserData {
  userId: string;
  name: string;
  email: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function fetchMe() {
      try {
        setLoading(true);
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUserData(data.user);
          setEditName(data.user.name || '');
        }
      } catch (err) {
        console.error('Failed to fetch user session:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);

  const handleStartEdit = () => {
    setEditName(userData?.name || '');
    setErrorMsg('');
    setSuccessMsg('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrorMsg('');
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    try {
      setSaving(true);
      setErrorMsg('');
      setSuccessMsg('');

      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to update profile name');
        return;
      }

      setUserData(prev => prev ? { ...prev, name: data.user.name } : data.user);
      setIsEditing(false);
      setSuccessMsg('Name updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Network error while updating profile name');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar
        currentTab="overview"
        onTabChange={() => {}}
        onOpenIntakeModal={() => {}}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="User Profile" subtitle="Manage your account details and profile information" />

        <main className="p-6 max-w-4xl w-full mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-900">Profile</span>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-3 animate-fadeIn">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Main Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header / Avatar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  {userData?.name ? userData.name.substring(0, 2).toUpperCase() : 'US'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    {loading ? 'Loading...' : userData?.name || 'Sales Professional'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">{userData?.email || 'DealDisha User'}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Authenticated & Active</span>
                  </div>
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors border border-indigo-200/50 self-start sm:self-center"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Profile Name
                </button>
              )}
            </div>

            {/* Editable Name Form or Information Grid */}
            {isEditing ? (
              <form onSubmit={handleSaveName} className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">Edit Name</h3>
                <div>
                  <label htmlFor="edit-name-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="edit-name-input"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    disabled={saving}
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    Save Name
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                <span className="text-sm font-semibold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-600" />
                    {loading ? 'Loading...' : userData?.name || 'N/A'}
                  </span>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="text-xs text-indigo-600 hover:underline font-medium"
                    >
                      Edit
                    </button>
                  )}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-indigo-600" />
                  {loading ? 'Loading...' : userData?.email || 'N/A'}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Account Creation Date</span>
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  {loading ? 'Loading...' : formatDate(userData?.createdAt)}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Organization</span>
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-indigo-600" />
                  DealDisha B2B Real Estate
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

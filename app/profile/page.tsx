'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { User, Mail, ShieldCheck, Calendar, Key, CheckCircle2, Building2 } from 'lucide-react';

interface UserData {
  userId: string;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUserData(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch user session:', err);
      }
    }
    fetchMe();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar
        currentTab="overview"
        onTabChange={() => {}}
        onOpenIntakeModal={() => {}}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="User Profile" subtitle="Manage your account preferences & security credentials" />

        <main className="p-6 max-w-4xl w-full mx-auto space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-900">Profile</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                {userData?.name ? userData.name.substring(0, 2).toUpperCase() : 'US'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{userData?.name || 'Sales Professional'}</h2>
                <p className="text-xs text-slate-500 font-medium">DealDisha Enterprise Sales Account</p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Authenticated & Verified</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-600" />
                  {userData?.name || 'Loading...'}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-indigo-600" />
                  {userData?.email || 'Loading...'}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Security Hashing</span>
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Key className="h-4 w-4 text-indigo-600" />
                  Salted bcrypt (cost 10)
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

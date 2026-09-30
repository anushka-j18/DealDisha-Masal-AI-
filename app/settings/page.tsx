'use client';

import React from 'react';
import Link from 'next/link';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Settings, Sliders, Database, Shield, Zap } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar
        currentTab="overview"
        onTabChange={() => {}}
        onOpenIntakeModal={() => {}}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Settings" subtitle="Configure system parameters and AI scoring rules" />

        <main className="p-6 max-w-4xl w-full mx-auto space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-900">Settings</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Settings</h2>
                <p className="text-xs text-slate-500 font-medium">Manage AI models, database connections, and notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-indigo-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Database Storage Engine</h3>
                    <p className="text-xs text-slate-500">SQLite file-based persistence via Prisma ORM</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">Active</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-indigo-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">AI Scoring Provider</h3>
                    <p className="text-xs text-slate-500">Google Gemini API (`gemini-2.5-flash`) + 6-Factor Engine</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-full border border-indigo-200">Connected</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-indigo-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Session Security</h3>
                    <p className="text-xs text-slate-500">HTTP-Only JWT cookies with strict middleware access control</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">Enabled</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

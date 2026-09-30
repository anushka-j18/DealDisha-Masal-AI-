'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Building2, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

function LoginForm() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  useEffect(() => {
    if (registered === 'true') {
      setShowSuccess(true);
    }
  }, [registered]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMsg('Authentication is coming soon! You can explore the Sales Dashboard directly.');
  };

  return (
    <div className="w-full max-w-md z-10">
      {/* Brand Logo & Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#0D121F] rounded-[10px] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="text-left">
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Deal<span className="text-emerald-400">Disha</span>
            </span>
            <span className="block text-[11px] font-medium text-emerald-400/90 tracking-wider uppercase">
              AI Sales Intelligence
            </span>
          </div>
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-white tracking-tight">Sign in to your account</h1>
        <p className="mt-1 text-sm text-slate-400">
          Welcome back! Access your strategic lead command center
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-[#121826]/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50">
        {showSuccess && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3 text-emerald-300 text-sm animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-300">Account created successfully!</p>
              <p className="text-xs text-emerald-400/80 mt-0.5">Please sign in with your email and password.</p>
            </div>
          </div>
        )}

        {infoMsg && (
          <div className="mb-6 p-3.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-start gap-3 text-cyan-300 text-sm animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>{infoMsg}</p>
              <Link href="/" className="inline-flex items-center gap-1 font-semibold text-emerald-400 hover:underline">
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-[#0A0D14] border border-slate-700/70 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80 text-slate-100 placeholder-slate-600 text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#0A0D14] border border-slate-700/70 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80 text-slate-100 placeholder-slate-600 text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-semibold text-sm rounded-xl py-3 px-4 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400 flex flex-col gap-2">
          <div>
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </div>
          <div>
            <Link
              href="/"
              className="text-slate-500 hover:text-slate-300 transition-colors text-[11px]"
            >
              ← Back to Sales Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <Suspense fallback={<div className="text-slate-400 text-sm">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

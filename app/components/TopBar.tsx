'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface TopBarProps {
  title: string;
  subtitle?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenIntakeModal?: () => void;
  user?: UserData;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle = 'AI-Powered Sales Intelligence',
  searchQuery = '',
  onSearchChange,
  onOpenIntakeModal,
  user: userProp,
}) => {
  const [user, setUser] = useState<UserData | null>(userProp || null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userProp) {
      setUser(userProp);
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser({
            name: data.user.name || 'Sales User',
            email: data.user.email || 'user@dealdisha.com',
          });
        }
      } catch (err) {
        console.error('Failed to load user for TopBar:', err);
      }
    }

    fetchUser();
  }, [userProp]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      window.location.href = '/login';
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'DD';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const userName = user?.name || 'Sales User';
  const userEmail = user?.email || 'user@dealdisha.com';
  const initials = getInitials(userName);

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">{title}</h1>
        <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {onSearchChange && (
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search leads, locations..."
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        )}

        <button className="relative p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors" title="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-600" />
        </button>

        <div className="h-4 w-px bg-slate-200" />

        {/* User Account Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100/80 transition-colors group cursor-pointer focus:outline-none"
            aria-expanded={isOpen}
            aria-haspopup="true"
            title="Account Menu"
          >
            <div className="h-7 w-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700/20 shadow-sm group-hover:ring-2 group-hover:ring-indigo-500/20 transition-all">
              {initials}
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in duration-150">
              {/* User Details */}
              <div className="px-3 py-2.5 bg-slate-50/80 rounded-lg mb-1 border border-slate-100 flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-0.5">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-colors group cursor-pointer"
                >
                  <User className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-colors group cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span>Settings</span>
                </Link>

                <div className="h-px bg-slate-100 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors group cursor-pointer text-left"
                >
                  <LogOut className="h-4 w-4 text-rose-500 group-hover:text-rose-600 transition-colors" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


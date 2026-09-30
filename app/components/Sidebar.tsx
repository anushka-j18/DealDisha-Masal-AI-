'use client';

import React from 'react';
import { LayoutDashboard, Users, BarChart3, Settings, Plus, Target, LogOut } from 'lucide-react';

interface SidebarProps {
  currentTab: 'overview' | 'leads' | 'insights';
  onTabChange: (tab: 'overview' | 'leads' | 'insights') => void;
  onOpenIntakeModal: () => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenIntakeModal,
  unreadCount = 0,
}) => {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      window.location.href = '/login';
    }
  };

  const navItems: { id: 'overview' | 'leads' | 'insights'; label: string; icon: any; badge?: number | null }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users, badge: unreadCount > 0 ? unreadCount : null },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
  ];

  return (
    <aside className="w-60 border-r border-slate-200 bg-white flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-20">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-sm shadow-sm">
              <Target className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
                Deal<span className="text-indigo-600">Disha</span>
              </h1>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                Sales Intelligence
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-3">
          <button
            onClick={onOpenIntakeModal}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Lead</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-2 space-y-0.5 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          title="Sign out of DealDisha"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="h-4 w-4 text-rose-500" />
            <span>Logout</span>
          </div>
        </button>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
              AJ
            </div>
            <div className="text-left leading-none">
              <span className="text-xs font-semibold text-slate-900 block">Anushka Joshi</span>
              <span className="text-[10px] text-slate-500 font-medium">Sales Rep</span>
            </div>
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-500" title="System Online" />
        </div>
      </div>
    </aside>
  );
};

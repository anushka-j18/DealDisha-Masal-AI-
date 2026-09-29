'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { MetricsOverview } from './components/MetricsOverview';
import { LeadFilters } from './components/LeadFilters';
import { LeadTable } from './components/LeadTable';
import { LeadIntakeModal } from './components/LeadIntakeModal';
import { LeadWorkspace } from './components/LeadWorkspace';
import { Lead, LeadIntakeInput } from '@/lib/types';
import { Loader2, Award, TrendingUp, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [currentTab, setCurrentTab] = useState<'overview' | 'leads' | 'insights'>('overview');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedTimeline, setSelectedTimeline] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'date_newest' | 'date_oldest'>('score_desc');

  // Intake Modal state
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch leads on mount
  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter & Sort Logic
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Priority filter
        if (selectedPriority !== 'ALL' && lead.analysis?.priority !== selectedPriority) {
          return false;
        }

        // Timeline filter
        if (selectedTimeline !== 'ALL') {
          const t = lead.buyingTimeline.toLowerCase();
          if (selectedTimeline === '1_month' && !t.includes('1 month') && !t.includes('immediate')) return false;
          if (selectedTimeline === '1_3_months' && !t.includes('1-3') && !t.includes('1 to 3')) return false;
          if (selectedTimeline === '3_6_months' && !t.includes('3-6') && !t.includes('3 to 6')) return false;
          if (selectedTimeline === '6_plus_months' && !t.includes('6+') && !t.includes('6 months')) return false;
        }

        // Search Query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const nameMatch = lead.customerName.toLowerCase().includes(q);
          const locMatch = lead.location.toLowerCase().includes(q);
          const reqMatch = lead.propertyRequirement.toLowerCase().includes(q);
          const msgMatch = lead.customerMessage.toLowerCase().includes(q);
          return nameMatch || locMatch || reqMatch || msgMatch;
        }

        return true;
      })
      .sort((a, b) => {
        const scoreA = a.analysis?.score || 0;
        const scoreB = b.analysis?.score || 0;

        if (sortBy === 'score_desc') return scoreB - scoreA;
        if (sortBy === 'score_asc') return scoreA - scoreB;

        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        if (sortBy === 'date_newest') return dateB - dateA;
        if (sortBy === 'date_oldest') return dateA - dateB;

        return 0;
      });
  }, [leads, selectedPriority, selectedTimeline, searchQuery, sortBy]);

  // Handle Lead Creation
  const handleCreateLead = async (input: LeadIntakeInput) => {
    setIsSubmittingLead(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await res.json();
      if (data.success && data.lead) {
        setLeads((prev) => [data.lead, ...prev]);
        setIsIntakeModalOpen(false);
        setSelectedLead(data.lead);
        showToast(`Lead "${data.lead.customerName}" analyzed and added!`);
      }
    } catch (err) {
      console.error('Failed to create lead:', err);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Handle Lead Deletion
  const handleDeleteLead = async (leadId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    if (!confirm('Are you sure you want to delete this lead record?')) return;

    try {
      const res = await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
        if (selectedLead?.id === leadId) setSelectedLead(null);
        showToast('Lead deleted successfully');
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  // Handle Lead Co-pilot Question
  const handleSendChatMessage = async (leadId: string, message: string): Promise<string> => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, message }),
      });

      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, chatHistory: data.chatHistory } : l))
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead((prev) => (prev ? { ...prev, chatHistory: data.chatHistory } : null));
        }
        return data.answer || 'Response generated.';
      }
      return 'Failed to get answer.';
    } catch (err) {
      console.error('Chat API error:', err);
      return 'Network error connecting to AI Co-pilot.';
    }
  };

  const hotCount = leads.filter((l) => l.analysis?.priority === 'HOT').length;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Left Application Shell Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setSelectedLead(null);
          setCurrentTab(tab);
        }}
        onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
        unreadCount={hotCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <TopBar
          title={
            selectedLead
              ? `Workspace · ${selectedLead.customerName}`
              : currentTab === 'overview'
              ? 'Dashboard'
              : currentTab === 'leads'
              ? 'Leads Pipeline'
              : 'Pipeline Insights'
          }
          subtitle={
            selectedLead
              ? `${selectedLead.propertyRequirement} · ${selectedLead.location}`
              : currentTab === 'overview'
              ? 'Real-time sales intelligence command center'
              : 'Manage and prioritize your inbound opportunities'
          }
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
        />

        {/* Page Main View */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-5 right-5 z-50 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl flex items-center gap-2 animate-in fade-in duration-200">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {selectedLead ? (
            /* LEAD DETAIL WORKSPACE VIEW */
            <LeadWorkspace
              lead={selectedLead}
              onBack={() => setSelectedLead(null)}
              onDelete={(id) => handleDeleteLead(id)}
              onSendMessage={handleSendChatMessage}
            />
          ) : currentTab === 'leads' ? (
            /* LEADS CRM PIPELINE VIEW */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Leads</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Manage and prioritize your inbound opportunities.
                  </p>
                </div>
              </div>

              <LeadFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedPriority={selectedPriority}
                onPriorityChange={setSelectedPriority}
                selectedTimeline={selectedTimeline}
                onTimelineChange={setSelectedTimeline}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              {loading ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Loading leads pipeline...</p>
                </div>
              ) : (
                <LeadTable
                  leads={filteredLeads}
                  title="All Inbound Opportunities"
                  subtitle="Dense scannable view sorted by score and purchase readiness"
                  onSelectLead={(lead) => setSelectedLead(lead)}
                  onDeleteLead={handleDeleteLead}
                />
              )}
            </div>
          ) : currentTab === 'insights' ? (
            /* PIPELINE INSIGHTS VIEW */
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Pipeline Insights</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Micro-market analytics and purchase intent breakdown.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Revenue Potential
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900 block">₹9.4 Crores</span>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> 5 Active Hot Deals
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Avg. Conversion Window
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900 block">18 Days</span>
                  <span className="text-xs text-slate-500 font-medium">For Hot priority leads</span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    AI Accuracy Rating
                  </span>
                  <span className="text-2xl font-extrabold text-indigo-600 block">98.4%</span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-indigo-600" /> Grounded in lead facts
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* DEFAULT DASHBOARD OVERVIEW VIEW */
            <div className="space-y-6">
              <MetricsOverview
                leads={leads}
                activePriorityFilter={selectedPriority}
                onSelectPriority={(p) => setSelectedPriority(p)}
              />

              <LeadFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedPriority={selectedPriority}
                onPriorityChange={setSelectedPriority}
                selectedTimeline={selectedTimeline}
                onTimelineChange={setSelectedTimeline}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              {loading ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Loading sales intelligence pipeline...</p>
                </div>
              ) : (
                <LeadTable
                  leads={filteredLeads}
                  title="Needs Attention"
                  subtitle="Highest-priority leads requiring immediate action today"
                  onSelectLead={(lead) => setSelectedLead(lead)}
                  onDeleteLead={handleDeleteLead}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add Lead Centered Workspace Modal */}
      <LeadIntakeModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onSubmit={handleCreateLead}
        isSubmitting={isSubmittingLead}
      />
    </div>
  );
}

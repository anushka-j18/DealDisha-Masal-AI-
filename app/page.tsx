'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { MetricsOverview } from './components/MetricsOverview';
import { LeadFilters } from './components/LeadFilters';
import { LeadTable } from './components/LeadTable';
import { LeadIntakeModal } from './components/LeadIntakeModal';
import { LeadWorkspace } from './components/LeadWorkspace';
import { Lead, LeadIntakeInput } from '@/lib/types';
import { Loader2, Sparkles, Target } from 'lucide-react';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedTimeline, setSelectedTimeline] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'date_newest' | 'date_oldest'>('score_desc');

  // Intake Modal state
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  // Fetch leads on mount
  const fetchLeads = async () => {
    setIsRefreshing(true);
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
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

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

  // Handle Lead Creation (Intake + AI Analysis)
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
        // Automatically open workspace for newly created & analyzed lead
        setSelectedLead(data.lead);
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
        if (selectedLead?.id === leadId) {
          setSelectedLead(null);
        }
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
        // Update local lead chat history
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

  const hotLeadsCount = leads.filter((l) => l.analysis?.priority === 'HOT').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
        totalLeadsCount={leads.length}
        hotLeadsCount={hotLeadsCount}
        onRefresh={fetchLeads}
        isRefreshing={isRefreshing}
      />

      {/* Main Workspace / Dashboard Area */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {selectedLead ? (
          /* Requirement 4: LEAD DETAIL WORKSPACE VIEW */
          <LeadWorkspace
            lead={selectedLead}
            onBack={() => setSelectedLead(null)}
            onDelete={(id) => handleDeleteLead(id)}
            onSendMessage={handleSendChatMessage}
          />
        ) : (
          /* Requirement 7: SALES DASHBOARD VIEW */
          <div className="space-y-6">
            {/* KPI Metrics Overview */}
            <MetricsOverview
              leads={leads}
              activePriorityFilter={selectedPriority}
              onSelectPriority={(p) => setSelectedPriority(p)}
            />

            {/* Search and Filters Bar */}
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

            {/* Priority Leads Table / Matrix */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-indigo-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Prioritized Inbound Leads Matrix ({filteredLeads.length})
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  Sorted by Score (Highest Urgency First)
                </span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 p-16 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mb-3" />
                  <p className="text-sm font-medium text-slate-300">
                    Loading sales intelligence pipeline...
                  </p>
                </div>
              ) : (
                <LeadTable
                  leads={filteredLeads}
                  onSelectLead={(lead) => setSelectedLead(lead)}
                  onDeleteLead={handleDeleteLead}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Requirement 1: LEAD INTAKE MODAL */}
      <LeadIntakeModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onSubmit={handleCreateLead}
        isSubmitting={isSubmittingLead}
      />
    </div>
  );
}

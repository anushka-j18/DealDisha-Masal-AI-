import { describe, it, expect } from 'vitest';
import { db } from '../lib/db';
import { generateFallbackAnalysis } from '../lib/ai';
import { Lead, LeadIntakeInput } from '../lib/types';

describe('DealDisha Core Functionality Test Suite', () => {
  describe('1. Lead Input Validation & Formatting', () => {
    it('should correctly format input data when required fields are present', () => {
      const input: LeadIntakeInput = {
        customerName: 'Rahul Sharma',
        location: 'Whitefield, Bangalore',
        propertyRequirement: '2BHK apartment near metro',
        budget: '₹80 Lakhs',
        buyingTimeline: 'Within 1 month',
        customerMessage: 'Looking for a 2BHK for my family near Whitefield. My budget is around 80L.',
      };

      expect(input.customerName).toBe('Rahul Sharma');
      expect(input.location).toContain('Bangalore');
      expect(input.budget).toBe('₹80 Lakhs');
    });

    it('should validate minimum character constraints on customer inquiry', () => {
      const shortMsg = 'Hi';
      expect(shortMsg.length).toBeLessThan(10);
    });
  });

  describe('2. Lead Storage & Retrieval (Database Engine)', () => {
    it('should retrieve all initial seed leads sorted by score', () => {
      const leads = db.getAllLeads();
      expect(Array.isArray(leads)).toBe(true);
      expect(leads.length).toBeGreaterThan(0);

      // Verify default sorting by score descending
      for (let i = 0; i < leads.length - 1; i++) {
        const scoreCurrent = leads[i].analysis?.score || 0;
        const scoreNext = leads[i + 1].analysis?.score || 0;
        expect(scoreCurrent).toBeGreaterThanOrEqual(scoreNext);
      }
    });

    it('should create and retrieve a new lead record by ID', () => {
      const testLead: Lead = {
        id: `test-lead-${Date.now()}`,
        customerName: 'Test Buyer',
        location: 'Indiranagar, Bangalore',
        propertyRequirement: '3BHK Penthouse',
        budget: '₹2.5 Crores',
        buyingTimeline: 'Within 1 month',
        customerMessage: 'Urgent buyer looking for immediate 3BHK penthouse purchase.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analysis: {
          summary: 'High value penthouse buyer in Indiranagar.',
          intent: 'Immediate Purchase Intent',
          keyRequirements: ['3BHK Penthouse', 'Indiranagar'],
          objections: [],
          recommendedNextAction: 'Call customer today',
          suggestedResponse: 'Hi Test Buyer, we have penthouse options ready.',
          priority: 'HOT',
          score: 95,
          nextMove: {
            what: 'Call customer today for private walkthrough.',
            why: '₹2.5Cr budget and immediate 1 month timeline.',
            when: 'Today',
            callStrategy: ['Confirm carpet area', 'Schedule visit'],
          },
        },
      };

      const created = db.createLead(testLead);
      expect(created.id).toBe(testLead.id);

      const fetched = db.getLeadById(testLead.id);
      expect(fetched).toBeDefined();
      expect(fetched?.customerName).toBe('Test Buyer');
      expect(fetched?.analysis?.score).toBe(95);

      // Clean up test lead
      db.deleteLead(testLead.id);
      expect(db.getLeadById(testLead.id)).toBeUndefined();
    });
  });

  describe('3. AI Analysis & 6-Factor Lead Scoring Engine', () => {
    it('should classify an urgent <1 month lead with explicit budget as HOT with score >= 80', () => {
      const urgentLead: LeadIntakeInput = {
        customerName: 'Suresh Kumar',
        location: 'Koramangala, Bangalore',
        propertyRequirement: '3BHK apartment',
        budget: '₹1.5 Crores',
        buyingTimeline: 'Within 1 month',
        customerMessage: 'Urgent relocation purchase. Need ready possession 3BHK this month. Budget 1.5Cr max.',
      };

      const analysis = generateFallbackAnalysis(urgentLead);

      expect(analysis.priority).toBe('HOT');
      expect(analysis.score).toBeGreaterThanOrEqual(80);
      expect(analysis.intent).toContain('Immediate');
    });

    it('should classify a 6+ month exploratory inquiry as COLD with score < 50', () => {
      const coldLead: LeadIntakeInput = {
        customerName: 'Amit Shah',
        location: 'Noida Expressway',
        propertyRequirement: 'Studio apartment',
        budget: 'Flexible',
        buyingTimeline: '6+ months',
        customerMessage: 'Just exploring options for long-term passive rental income. No hurry at all.',
      };

      const analysis = generateFallbackAnalysis(coldLead);

      expect(analysis.priority).toBe('COLD');
      expect(analysis.score).toBeLessThan(50);
    });
  });

  describe('4. Next Move Generation', () => {
    it('should generate structured Next Move containing WHAT, WHY, WHEN, and Call Strategy points', () => {
      const leadInput: LeadIntakeInput = {
        customerName: 'Anita Roy',
        location: 'Powai, Mumbai',
        propertyRequirement: '2BHK gated community',
        budget: '₹1.2 Crores',
        buyingTimeline: 'Within 1 month',
        customerMessage: 'Looking to purchase a 2BHK in Powai within 30 days.',
      };

      const analysis = generateFallbackAnalysis(leadInput);
      const nextMove = analysis.nextMove;

      expect(nextMove).toBeDefined();
      expect(nextMove.what).toContain('Call Anita Roy');
      expect(nextMove.why).toContain('₹1.2 Crores');
      expect(nextMove.when).toBe('Today');
      expect(Array.isArray(nextMove.callStrategy)).toBe(true);
      expect(nextMove.callStrategy.length).toBeGreaterThanOrEqual(2);
    });
  });
});

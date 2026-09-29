import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analyzeLeadWithAI } from '@/lib/ai';
import { Lead, LeadIntakeInput } from '@/lib/types';

export async function GET() {
  try {
    const leads = db.getAllLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error('API /api/leads GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: LeadIntakeInput = await req.json();

    if (!body.customerName || !body.customerMessage) {
      return NextResponse.json(
        { success: false, error: 'Customer Name and Customer Message are required.' },
        { status: 400 }
      );
    }

    // Perform REAL AI Lead Analysis
    const analysis = await analyzeLeadWithAI(body);

    const newLead: Lead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      customerName: body.customerName,
      location: body.location || 'Not Specified',
      propertyRequirement: body.propertyRequirement || 'Property Inquiry',
      budget: body.budget || 'Open / Flexible',
      buyingTimeline: body.buyingTimeline || 'Flexible',
      customerMessage: body.customerMessage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      analysis,
      chatHistory: []
    };

    const savedLead = db.createLead(newLead);
    return NextResponse.json({ success: true, lead: savedLead }, { status: 201 });
  } catch (error) {
    console.error('API /api/leads POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process lead' },
      { status: 500 }
    );
  }
}

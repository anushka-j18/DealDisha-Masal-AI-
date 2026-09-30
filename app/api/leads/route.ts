import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { analyzeLeadWithAI } from '../../../lib/ai';
import { Lead, LeadIntakeInput } from '../../../lib/types';
import { getSession } from '../../../lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const leads = await db.getAllLeads(session.userId);
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error('API /api/leads GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads from database' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let body: LeadIntakeInput;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload' },
        { status: 400 }
      );
    }

    // Step 1: Input Validation
    if (!body.customerName || !body.customerName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Customer Name is required.' },
        { status: 400 }
      );
    }

    if (!body.customerMessage || !body.customerMessage.trim()) {
      return NextResponse.json(
        { success: false, error: 'Customer Message is required.' },
        { status: 400 }
      );
    }

    // Step 2: AI Lead Analysis
    const analysis = await analyzeLeadWithAI(body);

    // Step 3: Construct Lead Record (Do NOT trust frontend userId; use server session.userId)
    const newLead: Lead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: session.userId,
      customerName: body.customerName.trim(),
      location: body.location?.trim() || 'Not Specified',
      propertyRequirement: body.propertyRequirement?.trim() || 'General Property Inquiry',
      budget: body.budget?.trim() || 'Open / Flexible',
      buyingTimeline: body.buyingTimeline?.trim() || 'Within 1 month',
      customerMessage: body.customerMessage.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      score: analysis.score,
      priority: analysis.priority,
      analysis,
      chatHistory: []
    };

    // Step 4: Persist Lead in Database for logged-in user
    const savedLead = await db.createLead(newLead, session.userId);

    // Step 5: Return Created Lead Response
    return NextResponse.json(
      { success: true, message: 'Lead saved successfully', lead: savedLead },
      { status: 201 }
    );
  } catch (error) {
    console.error('API /api/leads POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Database / API processing error saving lead' },
      { status: 500 }
    );
  }
}

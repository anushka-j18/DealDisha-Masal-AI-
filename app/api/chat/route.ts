import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { askLeadCopilot } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { leadId, message } = await req.json();

    if (!leadId || !message) {
      return NextResponse.json(
        { success: false, error: 'leadId and message are required.' },
        { status: 400 }
      );
    }

    const lead = await db.getLeadById(leadId);
    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found.' }, { status: 404 });
    }

    // Save user message to lead history
    await db.addChatMessage(leadId, 'user', message);

    // Get context-grounded AI answer
    const aiResponseText = await askLeadCopilot(lead, message);

    // Save AI assistant response to lead history
    const updatedLead = await db.addChatMessage(leadId, 'assistant', aiResponseText);

    return NextResponse.json({
      success: true,
      answer: aiResponseText,
      chatHistory: updatedLead?.chatHistory || []
    });
  } catch (error) {
    console.error('API /api/chat POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process chat question' }, { status: 500 });
  }
}

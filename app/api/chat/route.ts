import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { askLeadCopilot } from '../../../lib/ai';
import { getSession } from '../../../lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { leadId, message } = await req.json();

    if (!leadId || !message) {
      return NextResponse.json(
        { success: false, error: 'leadId and message are required.' },
        { status: 400 }
      );
    }

    const lead = await db.getLeadById(leadId, session.userId);
    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found or unauthorized.' }, { status: 404 });
    }

    // Save user message to lead history
    await db.addChatMessage(leadId, 'user', message, session.userId);

    // Get context-grounded AI answer
    const aiResponseText = await askLeadCopilot(lead, message);

    // Save AI assistant response to lead history
    const updatedLead = await db.addChatMessage(leadId, 'assistant', aiResponseText, session.userId);

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

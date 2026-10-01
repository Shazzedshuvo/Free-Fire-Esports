import { NextResponse } from 'next/server';
import { getChatThreads, getSessionMessages, addChatMessage } from '@/lib/chatStore';
import { getSessionUser, hasAdminAccess } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser || !hasAdminAccess(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      const messages = getSessionMessages(sessionId);
      return NextResponse.json({ messages });
    }

    const threads = getChatThreads();
    return NextResponse.json({ threads });
  } catch (error) {
    console.error('Error fetching admin chat:', error);
    return NextResponse.json({ error: 'Failed to fetch chat data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser || !hasAdminAccess(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { sessionId, text } = body;

    if (!sessionId || !text) {
      return NextResponse.json({ error: 'Session ID and text are required' }, { status: 400 });
    }

    const newMsg = addChatMessage({
      sessionId,
      sender: 'admin',
      senderName: currentUser.fullName || currentUser.username,
      senderRole: currentUser.role,
      userId: currentUser.id,
      username: currentUser.username,
      fullName: currentUser.fullName,
      text: text.trim(),
    });

    return NextResponse.json({ success: true, message: newMsg });
  } catch (error) {
    console.error('Error sending admin chat reply:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}

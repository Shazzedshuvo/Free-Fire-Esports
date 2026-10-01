import { NextResponse } from 'next/server';
import { getSessionMessages, addChatMessage } from '@/lib/chatStore';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const messages = getSessionMessages(sessionId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, text, senderName, ffUid, phoneNumber } = body;

    if (!sessionId || !text) {
      return NextResponse.json({ error: 'Session ID and text are required' }, { status: 400 });
    }

    // Check if logged in user
    const currentUser = await getSessionUser();

    const newMsg = addChatMessage({
      sessionId,
      sender: 'user',
      senderName: senderName || currentUser?.fullName || currentUser?.username || 'Player',
      userId: currentUser?.id,
      username: currentUser?.username,
      fullName: senderName || currentUser?.fullName,
      ffUid: ffUid || currentUser?.ffUid,
      phoneNumber: phoneNumber || currentUser?.mobileNumber,
      email: currentUser?.email,
      text: text.trim(),
    });

    return NextResponse.json({ success: true, message: newMsg });
  } catch (error) {
    console.error('Error posting chat message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

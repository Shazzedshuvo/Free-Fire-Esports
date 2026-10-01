import { NextResponse } from 'next/server';
import { getSessionMessages, addChatMessage, getAutoReply } from '@/lib/chatStore';
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

    const playerName = senderName || currentUser?.fullName || currentUser?.username || 'Player';
    const playerFfUid = ffUid || currentUser?.ffUid;
    const playerPhone = phoneNumber || currentUser?.mobileNumber;

    const newMsg = addChatMessage({
      sessionId,
      sender: 'user',
      senderName: playerName,
      userId: currentUser?.id,
      username: currentUser?.username,
      fullName: playerName,
      ffUid: playerFfUid,
      phoneNumber: playerPhone,
      email: currentUser?.email,
      text: text.trim(),
    });

    // Check for smart automated reply
    const autoReplyText = getAutoReply(text.trim());
    let autoReplyMsg = null;

    if (autoReplyText) {
      autoReplyMsg = addChatMessage({
        sessionId,
        sender: 'admin',
        senderName: 'সাপোর্ট অ্যাসিস্ট্যান্ট (Auto Support)',
        senderRole: 'ADMIN',
        text: autoReplyText,
      });
    }

    return NextResponse.json({
      success: true,
      message: newMsg,
      autoReply: autoReplyMsg,
    });
  } catch (error) {
    console.error('Error posting chat message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

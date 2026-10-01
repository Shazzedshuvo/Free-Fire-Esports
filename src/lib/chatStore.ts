import fs from 'fs';
import path from 'path';

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'user' | 'admin';
  senderName: string;
  senderRole?: string;
  text: string;
  time: string;
  timestamp: number;
  userId?: string;
  username?: string;
  fullName?: string;
  ffUid?: string;
  phoneNumber?: string;
  email?: string;
}

export interface ChatThread {
  sessionId: string;
  userId?: string;
  username?: string;
  fullName?: string;
  ffUid?: string;
  phoneNumber?: string;
  email?: string;
  lastMessage: string;
  lastMessageTime: string;
  lastTimestamp: number;
  unreadForAdmin: number;
  totalMessages: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const CHAT_FILE = path.join(DATA_DIR, 'live_chat.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CHAT_FILE)) {
    // Initial sample conversation so admin dashboard is never empty
    const initialMessages: ChatMessage[] = [
      {
        id: 'msg_sample_1',
        sessionId: 'session_demo_player',
        sender: 'user',
        senderName: 'Tanvir Hossain',
        senderRole: 'USER',
        text: 'ভাইয়া, আমি বিকাশ থেকে ৫০০ টাকা সেন্ড মানি করেছি, ট্রানজেকশন আইডি দিলাম। একটু ভেরিফাই করে দিন প্লিজ।',
        time: '10:02 AM',
        timestamp: Date.now() - 1000 * 60 * 15,
        username: 'tanvir_ff',
        fullName: 'Tanvir Hossain',
        ffUid: '1984729103',
        email: 'tanvir@gmail.com',
      },
      {
        id: 'msg_sample_2',
        sessionId: 'session_demo_player',
        sender: 'admin',
        senderName: 'Admin Chief',
        senderRole: 'SUPER_ADMIN',
        text: 'ধন্যবাদ তানভীর ভাই। আপনার TrxID চেক করা হচ্ছে, ২ মিনিটের মধ্যে ওয়ালেটে টাকা যুক্ত হয়ে যাবে।',
        time: '10:05 AM',
        timestamp: Date.now() - 1000 * 60 * 10,
        username: 'admin',
        fullName: 'Super Administrator',
      },
      {
        id: 'msg_sample_3',
        sessionId: 'session_demo_player_2',
        sender: 'user',
        senderName: 'Shuvo Gamer',
        senderRole: 'USER',
        text: 'আজকের স্কোয়াড টুর্নামেন্টের রুম আইডি কয়টায় দেওয়া হবে?',
        time: '10:08 AM',
        timestamp: Date.now() - 1000 * 60 * 5,
        username: 'shuvo_pro',
        fullName: 'Shuvo Rahman',
        ffUid: '2837491029',
        email: 'shuvo@gmail.com',
      },
    ];
    fs.writeFileSync(CHAT_FILE, JSON.stringify(initialMessages, null, 2), 'utf-8');
  }
}

export function getAllMessages(): ChatMessage[] {
  try {
    ensureDataFile();
    const data = fs.readFileSync(CHAT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading chat file:', error);
    return [];
  }
}

export function saveAllMessages(messages: ChatMessage[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(CHAT_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing chat file:', error);
  }
}

export function getSessionMessages(sessionId: string): ChatMessage[] {
  const all = getAllMessages();
  return all.filter((m) => m.sessionId === sessionId).sort((a, b) => a.timestamp - b.timestamp);
}

export function addChatMessage(params: {
  sessionId: string;
  sender: 'user' | 'admin';
  senderName: string;
  senderRole?: string;
  text: string;
  userId?: string;
  username?: string;
  fullName?: string;
  ffUid?: string;
  phoneNumber?: string;
  email?: string;
}): ChatMessage {
  const all = getAllMessages();
  const newMsg: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    sessionId: params.sessionId,
    sender: params.sender,
    senderName: params.senderName,
    senderRole: params.senderRole || (params.sender === 'admin' ? 'ADMIN' : 'USER'),
    text: params.text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now(),
    userId: params.userId,
    username: params.username,
    fullName: params.fullName,
    ffUid: params.ffUid,
    phoneNumber: params.phoneNumber,
    email: params.email,
  };

  all.push(newMsg);
  saveAllMessages(all);
  return newMsg;
}

export function getChatThreads(): ChatThread[] {
  const all = getAllMessages();
  const threadMap = new Map<string, ChatThread>();

  for (const msg of all) {
    const existing = threadMap.get(msg.sessionId);
    if (!existing) {
      threadMap.set(msg.sessionId, {
        sessionId: msg.sessionId,
        userId: msg.userId,
        username: msg.username,
        fullName: msg.fullName,
        ffUid: msg.ffUid,
        phoneNumber: msg.phoneNumber,
        email: msg.email,
        lastMessage: msg.text,
        lastMessageTime: msg.time,
        lastTimestamp: msg.timestamp,
        unreadForAdmin: msg.sender === 'user' ? 1 : 0,
        totalMessages: 1,
      });
    } else {
      existing.lastMessage = msg.text;
      existing.lastMessageTime = msg.time;
      existing.lastTimestamp = Math.max(existing.lastTimestamp, msg.timestamp);
      existing.totalMessages += 1;
      if (msg.sender === 'user') {
        existing.unreadForAdmin += 1;
      }
      if (msg.username) existing.username = msg.username;
      if (msg.fullName) existing.fullName = msg.fullName;
      if (msg.ffUid) existing.ffUid = msg.ffUid;
      if (msg.phoneNumber) existing.phoneNumber = msg.phoneNumber;
      if (msg.email) existing.email = msg.email;
    }
  }

  return Array.from(threadMap.values()).sort((a, b) => b.lastTimestamp - a.lastTimestamp);
}

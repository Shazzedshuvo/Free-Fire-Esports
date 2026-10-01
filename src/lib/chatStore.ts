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
  userName?: string;
  ffUid?: string;
  phoneNumber?: string;
  email?: string;
  lastMessage: string;
  lastMessageTime: string;
  lastTimestamp: number;
  lastUpdated?: number;
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

export function getAutoReply(text: string): string | null {
  const query = text.toLowerCase().trim();

  // 1. Room ID & Password timing
  if (
    query.includes('রুম') ||
    query.includes('room') ||
    query.includes('পাস') ||
    query.includes('pass') ||
    query.includes('কখন পাবো') ||
    query.includes('কখন দিবে') ||
    query.includes('কখন দেবে') ||
    query.includes('কয়টায়') ||
    query.includes('কখন আসবে')
  ) {
    return '🔔 টুর্নামেন্ট শুরু হওয়ার ঠিক ১০ মিনিট আগে "My Matches" পেজে রুম আইডি ও পাসওয়ার্ড স্বয়ংক্রিয়ভাবে দৃশ্যমান হবে। দয়া করে ম্যাচ শুরুর ৫ মিনিট আগে কাস্টম রুমে ঢুকে আপনার নির্দিষ্ট স্লটে অবস্থান করুন।';
  }

  // 2. Deposit Number
  if (
    query.includes('ডিপোজিট নম্বর') ||
    query.includes('deposit number') ||
    query.includes('নম্বর কত') ||
    query.includes('বিকাশ নম্বর') ||
    query.includes('নগদ নম্বর') ||
    query.includes('টাকা পাঠানোর নম্বর') ||
    query.includes('send money') ||
    query.includes('টাকা পাঠাবো কোন নম্বরে')
  ) {
    return '💰 আমাদের অফিশিয়াল বিকাশ/নগদ/রকেট (Personal) নম্বর: 01719052334। অ্যাপের Wallet > Deposit অপশনে গিয়ে Send Money করুন এবং আপনার প্রেরক নম্বর ও ট্রানজেকশন আইডি (TrxID) সাবমিট করুন।';
  }

  // 3. Deposit verification timing / pending balance
  if (
    query.includes('কত সময়') ||
    query.includes('কতক্ষণ') ||
    query.includes('টাকা অ্যাড') ||
    query.includes('ব্যালেন্স অ্যাড') ||
    query.includes('পেন্ডিং') ||
    query.includes('এড হতে') ||
    query.includes('অ্যাড হতে') ||
    query.includes('টাকা আসতে দেরি')
  ) {
    return '⏱️ টাকা পাঠিয়ে TrxID সাবমিট করার পর সাধারণত ৫ থেকে ১৫ মিনিটের মধ্যে অ্যাডমিন ভেরিফাই করে ব্যালেন্স যোগ করে দেন। যদি ১৫ মিনিটের বেশি দেরি হয়, তবে আপনার TrxID এবং পাঠানো মোবাইল নম্বর এখানে লিখে পাঠান।';
  }

  // 4. Tournament rules & requirements
  if (
    query.includes('নিয়ম') ||
    query.includes('নিয়ম') ||
    query.includes('rules') ||
    query.includes('লেভেল') ||
    query.includes('level') ||
    query.includes('র‍্যাঙ্ক') ||
    query.includes('rank') ||
    query.includes('heroic') ||
    query.includes('diamond') ||
    query.includes('যোগ্যতা')
  ) {
    return '⚠️ খেলার আবশ্যিক নিয়মাবলী:\n১. রেজিস্ট্রেশনের সময় দেওয়া ফ্রি ফায়ার UID দিয়েই কাস্টম রুমে জয়েন করতে হবে। অন্য আইডি দিয়ে জয়েন করলে সরাসরি ডিসকোয়ালিফাই করা হবে।\n২. আপনার আইডির লেভেল ৫০+ (Level 50+) হতে হবে।\n৩. ফুল ম্যাপ (BR) মোডের জন্য র‍্যাঙ্ক অবশ্যই Heroic হতে হবে।\n৪. ক্ল্যাশ স্কোয়াড (CS) মোডের জন্য র‍্যাঙ্ক সর্বনিম্ন Diamond IV হতে হবে।';
  }

  // 5. Withdraw rules
  if (
    query.includes('উইথড্র') ||
    query.includes('withdraw') ||
    query.includes('টাকা তুলব') ||
    query.includes('টাকা তোলা') ||
    query.includes('টাকা উঠাবো')
  ) {
    return '💳 টাকা উত্তোলনের (Withdraw) নিয়মাবলী:\nসর্বনিম্ন উত্তোলন ৫০ টাকা। Wallet > Withdraw অপশনে গিয়ে আপনার বিকাশ বা নগদ নম্বর ও কাঙ্ক্ষিত অ্যামাউন্ট সাবমিট করুন। ৩০ মিনিট থেকে ১ ঘণ্টার মধ্যে টাকা আপনার নম্বরে সেন্ড মানি হয়ে যাবে।';
  }

  // 6. Direct Contact with Admin
  if (
    query.includes('কথা বলতে চাই') ||
    query.includes('অ্যাডমিন') ||
    query.includes('admin') ||
    query.includes('সরাসরি') ||
    query.includes('help') ||
    query.includes('সাহায্য')
  ) {
    return '👨‍💻 আমাদের সাপোর্ট টিম আপনার মেসেজ পেয়েছে। একজন অ্যাডমিন খুব শীঘ্রই আপনার সাথে সরাসরি যুক্ত হয়ে উত্তর দেবেন। জরুরি প্রয়োজনে WhatsApp: 01719052334 এ সরাসরি যোগাযোগ করতে পারেন।';
  }

  return null;
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
  const validTimestamp = Date.now();
  const validTime = new Date(validTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newMsg: ChatMessage = {
    id: `msg_${validTimestamp}_${Math.random().toString(36).substring(2, 7)}`,
    sessionId: params.sessionId,
    sender: params.sender,
    senderName: params.senderName,
    senderRole: params.senderRole || (params.sender === 'admin' ? 'ADMIN' : 'USER'),
    text: params.text,
    time: validTime,
    timestamp: validTimestamp,
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
    const validTime = typeof msg.timestamp === 'number' && !isNaN(msg.timestamp) ? msg.timestamp : Date.now();
    const displayName = msg.fullName || msg.senderName || msg.username || 'Player';

    if (!existing) {
      threadMap.set(msg.sessionId, {
        sessionId: msg.sessionId,
        userId: msg.userId,
        username: msg.username,
        fullName: displayName,
        userName: displayName,
        ffUid: msg.ffUid,
        phoneNumber: msg.phoneNumber,
        email: msg.email,
        lastMessage: msg.text,
        lastMessageTime: msg.time || new Date(validTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lastTimestamp: validTime,
        lastUpdated: validTime,
        unreadForAdmin: msg.sender === 'user' ? 1 : 0,
        totalMessages: 1,
      });
    } else {
      existing.lastMessage = msg.text;
      existing.lastMessageTime = msg.time || new Date(validTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      existing.lastTimestamp = Math.max(existing.lastTimestamp, validTime);
      existing.lastUpdated = existing.lastTimestamp;
      existing.totalMessages += 1;
      if (msg.sender === 'user') {
        existing.unreadForAdmin += 1;
      }
      if (displayName && displayName !== 'Player') {
        existing.userName = displayName;
        existing.fullName = displayName;
      }
      if (msg.username) existing.username = msg.username;
      if (msg.ffUid) existing.ffUid = msg.ffUid;
      if (msg.phoneNumber) existing.phoneNumber = msg.phoneNumber;
      if (msg.email) existing.email = msg.email;
    }
  }

  return Array.from(threadMap.values()).sort((a, b) => b.lastTimestamp - a.lastTimestamp);
}

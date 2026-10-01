import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OFFICIAL_DEPOSIT_NUMBER } from '@/components/DepositModal';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findMany();
    const map: Record<string, string> = {
      site_name: 'Free Fire Esports BD',
      bkash_number: OFFICIAL_DEPOSIT_NUMBER,
      support_whatsapp: OFFICIAL_DEPOSIT_NUMBER,
      support_telegram: 'https://t.me/ff_esports_bd',
      youtube_live_url: 'https://www.youtube.com',
      facebook_live_url: 'https://www.facebook.com',
      notice_text: 'টুর্নামেন্ট শুরু হওয়ার ১০ মিনিট আগে রুম আইডি এবং পাসওয়ার্ড দেওয়া হবে।',
    };

    settings.forEach((s) => {
      map[s.key] = s.value;
    });

    return NextResponse.json({ settings: map });
  } catch (error) {
    return NextResponse.json({
      settings: {
        site_name: 'Free Fire Esports BD',
        bkash_number: OFFICIAL_DEPOSIT_NUMBER,
        support_whatsapp: OFFICIAL_DEPOSIT_NUMBER,
        support_telegram: 'https://t.me/ff_esports_bd',
        youtube_live_url: 'https://www.youtube.com',
        facebook_live_url: 'https://www.facebook.com',
        notice_text: 'টুর্নামেন্ট শুরু হওয়ার ১০ মিনিট আগে রুম আইডি এবং পাসওয়ার্ড দেওয়া হবে।',
      },
    });
  }
}

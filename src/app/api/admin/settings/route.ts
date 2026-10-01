import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, hasAdminAccess } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({ settings: settingsMap });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser || !hasAdminAccess(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { settings } = body; // object with key-value pairs

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings object' }, { status: 400 });
    }

    for (const [key, value] of Object.entries(settings)) {
      await prisma.systemSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    await prisma.auditLog.create({
      data: {
        adminId: currentUser.id,
        adminName: currentUser.fullName,
        action: 'UPDATE_SETTINGS',
        target: 'SYSTEM_SETTINGS',
        details: `Updated platform settings`,
      },
    });

    return NextResponse.json({ success: true, message: 'Settings saved successfully.' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

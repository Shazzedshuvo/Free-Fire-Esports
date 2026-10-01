import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, hasAdminAccess } from '@/lib/auth';

export async function GET() {
  try {
    const notices = await prisma.notice.findMany({
      where: { isActive: true },
      orderBy: [
        { isPinned: 'desc' },
        { publishDate: 'desc' },
      ],
      take: 20,
    });

    return NextResponse.json({ notices });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser || !hasAdminAccess(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, type, isPinned } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 });
    }

    const newNotice = await prisma.notice.create({
      data: {
        title,
        description,
        type: type || 'IMPORTANT',
        isPinned: Boolean(isPinned),
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, notice: newNotice });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create notice' }, { status: 500 });
  }
}

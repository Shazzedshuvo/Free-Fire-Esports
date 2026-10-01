import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deposits = await prisma.depositRequest.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ deposits });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deposit requests' }, { status: 500 });
  }
}

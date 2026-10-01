import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    const wallet = await prisma.wallet.findUnique({
      where: { userId: currentUser.id },
    });

    if (!wallet) {
      return NextResponse.json({ transactions: [], wallet: null });
    }

    const whereClause: any = { walletId: wallet.id };
    if (type && type !== 'ALL') {
      whereClause.type = type.toUpperCase();
    }

    const transactions = await prisma.walletTransaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      wallet,
      transactions,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

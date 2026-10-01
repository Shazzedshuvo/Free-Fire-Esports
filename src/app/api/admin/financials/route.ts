import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, hasAdminAccess } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser || !hasAdminAccess(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 1. Calculate Entry Fees Collected
    const participants = await prisma.tournamentParticipant.findMany({
      include: {
        tournament: {
          select: { entryFee: true, title: true, id: true },
        },
      },
    });

    const totalEntryFees = participants.reduce((sum, p) => sum + (p.tournament?.entryFee || 0), 0);

    // 2. Calculate Prize Money Paid Out
    const results = await prisma.tournamentResult.findMany({
      where: { isPrizeDistributed: true },
    });
    const totalPrizesPaid = results.reduce((sum, r) => sum + (r.prizeEarned || 0), 0);

    // 3. Platform Profit / Loss
    const netProfit = totalEntryFees - totalPrizesPaid;
    const profitMargin = totalEntryFees > 0 ? ((netProfit / totalEntryFees) * 100).toFixed(1) : '0';

    // 4. Deposits Statistics
    const approvedDeposits = await prisma.depositRequest.findMany({
      where: { status: 'APPROVED' },
    });
    const totalDeposited = approvedDeposits.reduce((sum, d) => sum + d.amount, 0);

    const pendingDeposits = await prisma.depositRequest.findMany({
      where: { status: 'PENDING' },
    });
    const pendingCount = pendingDeposits.length;
    const pendingAmount = pendingDeposits.reduce((sum, d) => sum + d.amount, 0);

    // 5. Total Tournament Counts
    const totalTournaments = await prisma.tournament.count();
    const liveTournaments = await prisma.tournament.count({ where: { status: 'LIVE' } });
    const completedTournaments = await prisma.tournament.count({ where: { status: 'COMPLETED' } });

    // 6. Total User Wallet Circulation
    const wallets = await prisma.wallet.findMany();
    const totalCirculatingBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

    return NextResponse.json({
      financials: {
        totalEntryFees,
        totalPrizesPaid,
        netProfit,
        profitMargin,
        totalDeposited,
        pendingCount,
        pendingAmount,
        totalTournaments,
        liveTournaments,
        completedTournaments,
        totalCirculatingBalance,
        totalParticipants: participants.length,
      },
    });
  } catch (error) {
    console.error('Error fetching admin financials:', error);
    return NextResponse.json({ error: 'Failed to fetch financial data' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, hasAdminAccess } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser || !hasAdminAccess(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const [
      totalUsers,
      activeUsers,
      totalTournaments,
      upcomingTournaments,
      completedMatches,
      allDeposits,
      wallets,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isSuspended: false } }),
      prisma.tournament.count(),
      prisma.tournament.count({ where: { status: { in: ['REGISTRATION_OPEN', 'UPCOMING'] } } }),
      prisma.tournament.count({ where: { status: 'COMPLETED' } }),
      prisma.depositRequest.findMany({ select: { amount: true, status: true, createdAt: true } }),
      prisma.wallet.findMany({ select: { balance: true, totalDeposited: true, totalWon: true, totalEntryFees: true } }),
      prisma.auditLog.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
    ]);

    const totalDepositedAmount = allDeposits
      .filter((d) => d.status === 'APPROVED')
      .reduce((sum, d) => sum + d.amount, 0);

    const pendingDepositsCount = allDeposits.filter((d) => d.status === 'PENDING').length;
    const approvedDepositsCount = allDeposits.filter((d) => d.status === 'APPROVED').length;

    const totalWalletBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
    const totalPrizeDistributed = wallets.reduce((sum, w) => sum + w.totalWon, 0);
    const totalEntryFees = wallets.reduce((sum, w) => sum + w.totalEntryFees, 0);

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        totalTournaments,
        upcomingTournaments,
        completedMatches,
        totalDeposits: totalDepositedAmount,
        pendingDepositsCount,
        approvedDepositsCount,
        totalWalletBalance,
        totalPrizeDistributed,
        totalEntryFees,
      },
      recentAuditLogs,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}

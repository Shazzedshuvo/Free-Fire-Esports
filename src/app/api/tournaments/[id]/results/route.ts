import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, hasAdminAccess } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser || !hasAdminAccess(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const { results, winnerTeam } = body; 
    // results is array of: { rank, playerNameOrTeam, kills, placementPoints, totalPoints, prizeEarned, userId }

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: 'Results list cannot be empty.' }, { status: 400 });
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id },
    });

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found.' }, { status: 404 });
    }

    // Process prize distribution in atomic transaction
    await prisma.$transaction(async (tx) => {
      // 1. Delete any existing results for this tournament
      await tx.tournamentResult.deleteMany({
        where: { tournamentId: id },
      });

      // 2. Insert new results
      for (const res of results) {
        const prize = Number(res.prizeEarned) || 0;

        await tx.tournamentResult.create({
          data: {
            tournamentId: id,
            rank: Number(res.rank),
            playerNameOrTeam: res.playerNameOrTeam,
            kills: Number(res.kills) || 0,
            placementPoints: Number(res.placementPoints) || 0,
            totalPoints: Number(res.totalPoints) || 0,
            prizeEarned: prize,
            isPrizeDistributed: prize > 0,
            userId: res.userId || null,
          },
        });

        // 3. If player is registered and has prize > 0, credit their wallet
        if (res.userId && prize > 0) {
          const userWallet = await tx.wallet.findUnique({
            where: { userId: res.userId },
          });

          if (userWallet) {
            const newBal = userWallet.balance + prize;
            await tx.wallet.update({
              where: { id: userWallet.id },
              data: {
                balance: newBal,
                totalWon: userWallet.totalWon + prize,
              },
            });

            await tx.walletTransaction.create({
              data: {
                walletId: userWallet.id,
                type: 'PRIZE',
                amount: prize,
                balanceAfter: newBal,
                paymentMethod: 'Internal Wallet',
                status: 'APPROVED',
                tournamentId: id,
                notes: `Tournament Prize: Rank #${res.rank} in "${tournament.title}"`,
              },
            });

            await tx.notification.create({
              data: {
                userId: res.userId,
                title: `Prize Credited: ৳${prize}!`,
                message: `Congratulations on Rank #${res.rank} in "${tournament.title}". ৳${prize} added to your wallet.`,
                type: 'PRIZE_ADDED',
              },
            });
          }
        }
      }

      // 4. Update tournament status to COMPLETED
      await tx.tournament.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          winnerTeam: winnerTeam || results[0]?.playerNameOrTeam || 'Champion',
        },
      });

      // 5. Create audit log
      await tx.auditLog.create({
        data: {
          adminId: currentUser.id,
          adminName: currentUser.fullName,
          action: 'PUBLISH_RESULTS',
          target: id,
          details: `Published tournament results for "${tournament.title}" and distributed prize pool.`,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Tournament results published and prizes credited to player wallets successfully.',
    });
  } catch (error: any) {
    console.error('Error publishing tournament results:', error);
    return NextResponse.json({ error: error.message || 'Failed to publish results' }, { status: 500 });
  }
}

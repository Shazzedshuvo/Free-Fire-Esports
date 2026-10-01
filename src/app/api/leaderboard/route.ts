import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all'; // all, monthly, weekly, daily

    // Retrieve users with wallets and tournament participants
    const users = await prisma.user.findMany({
      where: {
        role: 'USER',
        isSuspended: false,
      },
      include: {
        wallet: true,
        tournamentParticipants: true,
      },
    });

    // Also get results from tournamentResult
    const results = await prisma.tournamentResult.findMany();

    const leaderboard = users.map((u) => {
      const userResults = results.filter((r) => r.userId === u.id);
      const kills = userResults.reduce((acc, r) => acc + r.kills, 0);
      const points = userResults.reduce((acc, r) => acc + r.totalPoints, 0);
      const wins = userResults.filter((r) => r.rank === 1).length;
      const earnings = u.wallet?.totalWon || 0;
      const matches = u.tournamentParticipants.length;

      return {
        id: u.id,
        username: u.username,
        ffPlayerName: u.ffPlayerName,
        ffUid: u.ffUid,
        avatarUrl: u.avatarUrl,
        matches,
        wins,
        kills,
        points: points || (wins * 20 + kills * 2),
        earnings,
      };
    });

    // Sort by earnings, then wins, then kills
    leaderboard.sort((a, b) => {
      if (b.earnings !== a.earnings) return b.earnings - a.earnings;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.kills - a.kills;
    });

    const ranked = leaderboard.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    return NextResponse.json({ leaderboard: ranked });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

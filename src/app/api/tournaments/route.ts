import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, hasAdminAccess } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode'); // SOLO, DUO, SQUAD
    const status = searchParams.get('status'); // REGISTRATION_OPEN, LIVE, COMPLETED, UPCOMING
    const filter = searchParams.get('filter'); // free, paid, my

    const currentUser = await getSessionUser();

    const whereClause: any = {};
    if (mode && mode !== 'ALL') {
      whereClause.gameMode = mode.toUpperCase();
    }
    if (status && status !== 'ALL') {
      whereClause.status = status.toUpperCase();
    }
    if (filter === 'free') {
      whereClause.entryFee = 0;
    } else if (filter === 'paid') {
      whereClause.entryFee = { gt: 0 };
    }

    if (filter === 'my' && currentUser) {
      whereClause.participants = {
        some: {
          userId: currentUser.id,
        },
      };
    }

    const tournaments = await prisma.tournament.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { participants: true },
        },
        participants: currentUser
          ? {
              where: { userId: currentUser.id },
              select: { id: true, slotNumber: true },
            }
          : false,
      },
    });

    const formatted = tournaments.map((t) => ({
      ...t,
      isUserJoined: currentUser ? t.participants?.length > 0 : false,
      // Hide room password in list view if user is not joined
      roomId: (currentUser && t.participants?.length > 0 && t.isRoomCredentialsPublished) || hasAdminAccess(currentUser?.role) ? t.roomId : null,
      roomPassword: (currentUser && t.participants?.length > 0 && t.isRoomCredentialsPublished) || hasAdminAccess(currentUser?.role) ? t.roomPassword : null,
    }));

    return NextResponse.json({ tournaments: formatted });
  } catch (error: any) {
    console.error('Error fetching tournaments:', error);
    return NextResponse.json({ error: 'Failed to fetch tournaments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser || !hasAdminAccess(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      bannerImage,
      description,
      gameMode,
      mapName,
      entryFee,
      prizePool,
      winnerPrize,
      runnerUpPrize,
      thirdPlacePrize,
      perKillPrize,
      totalSlots,
      matchDate,
      matchTime,
      rules,
      liveStreamUrl,
    } = body;

    if (!title || !gameMode || !mapName || totalSlots === undefined) {
      return NextResponse.json({ error: 'Required tournament fields missing.' }, { status: 400 });
    }

    const newTournament = await prisma.tournament.create({
      data: {
        title,
        bannerImage: bannerImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
        description: description || 'Free Fire competitive esports custom room battle.',
        gameMode: gameMode.toUpperCase(),
        mapName: mapName || 'Bermuda',
        entryFee: Number(entryFee) || 0,
        prizePool: Number(prizePool) || 0,
        winnerPrize: Number(winnerPrize) || 0,
        runnerUpPrize: Number(runnerUpPrize) || 0,
        thirdPlacePrize: Number(thirdPlacePrize) || 0,
        perKillPrize: Number(perKillPrize) || 0,
        totalSlots: Number(totalSlots),
        remainingSlots: Number(totalSlots),
        matchDate: matchDate || 'Today',
        matchTime: matchTime || '08:00 PM',
        registrationDeadline: new Date(Date.now() + 86400000),
        liveStreamUrl: liveStreamUrl || null,
        rules: rules || 'Standard Free Fire esports rules apply. Mobile only. No teaming or hacking.',
        status: 'REGISTRATION_OPEN',
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: currentUser.id,
        adminName: currentUser.fullName,
        action: 'CREATE_TOURNAMENT',
        target: newTournament.id,
        details: `Created tournament: ${newTournament.title} (${newTournament.gameMode})`,
      },
    });

    return NextResponse.json({ success: true, tournament: newTournament });
  } catch (error: any) {
    console.error('Error creating tournament:', error);
    return NextResponse.json({ error: 'Failed to create tournament' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, hasAdminAccess } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const currentUser = await getSessionUser();

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        participants: {
          select: {
            id: true,
            slotNumber: true,
            teamName: true,
            player1Name: true,
            player1Uid: true,
            player2Name: true,
            player2Uid: true,
            player3Name: true,
            player3Uid: true,
            player4Name: true,
            player4Uid: true,
            player5Name: true,
            player5Uid: true,
            userId: true,
            joinedAt: true,
          },
          orderBy: { slotNumber: 'asc' },
        },
        results: {
          orderBy: { rank: 'asc' },
        },
      },
    });

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    const isJoined = currentUser ? tournament.participants.some((p) => p.userId === currentUser.id) : false;
    const isAdmin = hasAdminAccess(currentUser?.role);

    // Only show Room ID and Password if published AND (user is registered OR is admin)
    const canSeeRoomCredentials = (tournament.isRoomCredentialsPublished && isJoined) || isAdmin;

    const sanitizedTournament = {
      ...tournament,
      isUserJoined: isJoined,
      roomId: canSeeRoomCredentials ? tournament.roomId : null,
      roomPassword: canSeeRoomCredentials ? tournament.roomPassword : null,
      canSeeRoomCredentials,
    };

    return NextResponse.json({ tournament: sanitizedTournament });
  } catch (error: any) {
    console.error('Error fetching tournament details:', error);
    return NextResponse.json({ error: 'Failed to fetch tournament details' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser || !hasAdminAccess(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const updated = await prisma.tournament.update({
      where: { id },
      data: {
        title: body.title,
        bannerImage: body.bannerImage,
        description: body.description,
        gameMode: body.gameMode,
        mapName: body.mapName,
        entryFee: body.entryFee !== undefined ? Number(body.entryFee) : undefined,
        prizePool: body.prizePool !== undefined ? Number(body.prizePool) : undefined,
        winnerPrize: body.winnerPrize !== undefined ? Number(body.winnerPrize) : undefined,
        runnerUpPrize: body.runnerUpPrize !== undefined ? Number(body.runnerUpPrize) : undefined,
        thirdPlacePrize: body.thirdPlacePrize !== undefined ? Number(body.thirdPlacePrize) : undefined,
        perKillPrize: body.perKillPrize !== undefined ? Number(body.perKillPrize) : undefined,
        totalSlots: body.totalSlots !== undefined ? Number(body.totalSlots) : undefined,
        remainingSlots: body.remainingSlots !== undefined ? Number(body.remainingSlots) : undefined,
        matchDate: body.matchDate,
        matchTime: body.matchTime,
        rules: body.rules,
        status: body.status,
        roomId: body.roomId,
        roomPassword: body.roomPassword,
        isRoomCredentialsPublished: body.isRoomCredentialsPublished,
        liveStreamUrl: body.liveStreamUrl !== undefined ? body.liveStreamUrl : undefined,
      },
    });

    // If room credentials were just published, notify joined participants
    if (body.isRoomCredentialsPublished && body.roomId) {
      const participants = await prisma.tournamentParticipant.findMany({
        where: { tournamentId: id },
        select: { userId: true },
      });

      for (const p of participants) {
        await prisma.notification.create({
          data: {
            userId: p.userId,
            title: `Room ID Published: ${updated.title}`,
            message: `Room ID: ${body.roomId} | Password: ${body.roomPassword || 'None'}. Join custom lobby now!`,
            type: 'ROOM_ID_PUBLISHED',
          },
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        adminId: currentUser.id,
        adminName: currentUser.fullName,
        action: 'UPDATE_TOURNAMENT',
        target: id,
        details: `Updated tournament: ${updated.title} (Status: ${updated.status}, RoomPub: ${updated.isRoomCredentialsPublished})`,
      },
    });

    return NextResponse.json({ success: true, tournament: updated });
  } catch (error: any) {
    console.error('Error updating tournament:', error);
    return NextResponse.json({ error: 'Failed to update tournament' }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  return PUT(req, context);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser || !hasAdminAccess(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;
    await prisma.tournament.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Tournament deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting tournament:', error);
    return NextResponse.json({ error: 'Failed to delete tournament' }, { status: 500 });
  }
}

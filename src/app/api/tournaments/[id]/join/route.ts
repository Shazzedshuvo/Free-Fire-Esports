import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'You must be logged in to join a tournament.' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const {
      teamName,
      player1Name,
      player1Uid,
      player2Name,
      player2Uid,
      player3Name,
      player3Uid,
      player4Name,
      player4Uid,
      player5Name,
      player5Uid,
    } = body;

    // Use Prisma transaction to ensure atomic execution
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch tournament with lock or fresh state
      const tournament = await tx.tournament.findUnique({
        where: { id },
        include: {
          participants: {
            where: { userId: currentUser.id },
          },
        },
      });

      if (!tournament) {
        throw new Error('Tournament not found.');
      }

      if (tournament.status !== 'REGISTRATION_OPEN') {
        throw new Error('Tournament registration is currently closed or tournament is not active.');
      }

      if (tournament.remainingSlots <= 0) {
        throw new Error('Tournament is full. No available slots.');
      }

      // Check if user already joined
      if (tournament.participants.length > 0) {
        throw new Error('You have already joined this tournament.');
      }

      // 2. Mode validation
      if (tournament.gameMode === 'DUO') {
        if (!player2Name || !player2Uid) {
          throw new Error('Player 2 Name and Free Fire UID are required for Duo tournaments.');
        }
      } else if (tournament.gameMode === 'SQUAD') {
        if (!player2Name || !player2Uid || !player3Name || !player3Uid || !player4Name || !player4Uid) {
          throw new Error('All 4 squad players (Name & UID) are required for Squad tournaments.');
        }
      }

      // 3. Fetch user wallet with fresh balance
      const wallet = await tx.wallet.findUnique({
        where: { userId: currentUser.id },
      });

      if (!wallet) {
        throw new Error('User wallet not found.');
      }

      const entryFee = tournament.entryFee;
      if (wallet.balance < entryFee) {
        throw new Error(`Insufficient wallet balance. Entry fee is ৳${entryFee}, but your wallet has ৳${wallet.balance}. Please deposit funds.`);
      }

      // 4. Calculate slot number
      const currentParticipantsCount = await tx.tournamentParticipant.count({
        where: { tournamentId: id },
      });
      const slotNumber = currentParticipantsCount + 1;

      // 5. Deduct from wallet
      const newBalance = wallet.balance - entryFee;
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: newBalance,
          totalEntryFees: wallet.totalEntryFees + entryFee,
        },
      });

      // 6. Create wallet transaction record
      const txn = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'TOURNAMENT_ENTRY',
          amount: -entryFee,
          balanceAfter: newBalance,
          paymentMethod: 'Internal Wallet',
          status: 'APPROVED',
          tournamentId: tournament.id,
          notes: `Entry fee deducted for "${tournament.title}" (Slot #${slotNumber})`,
        },
      });

      // 7. Register participant
      const participant = await tx.tournamentParticipant.create({
        data: {
          tournamentId: tournament.id,
          userId: currentUser.id,
          slotNumber,
          teamName: teamName || (tournament.gameMode !== 'SOLO' ? `${currentUser.username}'s Team` : null),
          player1Name: player1Name || currentUser.ffPlayerName,
          player1Uid: player1Uid || currentUser.ffUid,
          player2Name: player2Name || null,
          player2Uid: player2Uid || null,
          player3Name: player3Name || null,
          player3Uid: player3Uid || null,
          player4Name: player4Name || null,
          player4Uid: player4Uid || null,
          player5Name: player5Name || null,
          player5Uid: player5Uid || null,
        },
      });

      // 8. Decrease remaining slot & update status if full
      const newRemainingSlots = tournament.remainingSlots - 1;
      await tx.tournament.update({
        where: { id: tournament.id },
        data: {
          remainingSlots: newRemainingSlots,
          status: newRemainingSlots === 0 ? 'FULL' : 'REGISTRATION_OPEN',
        },
      });

      // 9. Send Notification to User
      await tx.notification.create({
        data: {
          userId: currentUser.id,
          title: `Registered: ${tournament.title}`,
          message: `Slot #${slotNumber} secured. Room credentials will appear in My Matches before match start.`,
          type: 'TOURNAMENT_JOINED',
        },
      });

      return {
        participant,
        newBalance: updatedWallet.balance,
        transactionId: txn.id,
        slotNumber,
      };
    });

    return NextResponse.json({
      success: true,
      message: 'You have successfully joined this tournament.',
      ...result,
    });
  } catch (error: any) {
    console.error('Error joining tournament:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to join tournament.' },
      { status: 400 }
    );
  }
}

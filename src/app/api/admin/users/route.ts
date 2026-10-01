import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, hasAdminAccess } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser || !hasAdminAccess(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    const whereClause: any = {};
    if (query) {
      whereClause.OR = [
        { username: { contains: query } },
        { fullName: { contains: query } },
        { ffUid: { contains: query } },
        { email: { contains: query } },
        { mobileNumber: { contains: query } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        wallet: true,
        _count: {
          select: { tournamentParticipants: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser || !hasAdminAccess(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, action, amount, reason, role, isSuspended } = body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'TOGGLE_SUSPEND') {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { isSuspended: Boolean(isSuspended) },
      });

      await prisma.auditLog.create({
        data: {
          adminId: currentUser.id,
          adminName: currentUser.fullName,
          action: isSuspended ? 'SUSPEND_USER' : 'ACTIVATE_USER',
          target: userId,
          details: `${isSuspended ? 'Suspended' : 'Activated'} user ${user.username}`,
        },
      });

      return NextResponse.json({ success: true, user: updated });
    }

    if (action === 'CHANGE_ROLE') {
      if (currentUser.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Only Super Admin can change user roles.' }, { status: 403 });
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: { role },
      });

      await prisma.auditLog.create({
        data: {
          adminId: currentUser.id,
          adminName: currentUser.fullName,
          action: 'CHANGE_ROLE',
          target: userId,
          details: `Changed role of ${user.username} to ${role}`,
        },
      });

      return NextResponse.json({ success: true, user: updated });
    }

    if (action === 'ADJUST_WALLET') {
      const adjustmentAmount = Number(amount);
      if (!adjustmentAmount || adjustmentAmount === 0) {
        return NextResponse.json({ error: 'Valid amount is required.' }, { status: 400 });
      }

      if (!reason || reason.trim().length < 3) {
        return NextResponse.json({ error: 'A specific reason is required for manual balance adjustment.' }, { status: 400 });
      }

      const currentBalance = user.wallet?.balance || 0;
      const newBalance = currentBalance + adjustmentAmount;

      if (newBalance < 0) {
        return NextResponse.json({ error: 'Adjustment would result in negative wallet balance.' }, { status: 400 });
      }

      await prisma.$transaction(async (tx) => {
        // Update wallet
        await tx.wallet.update({
          where: { userId },
          data: { balance: newBalance },
        });

        // Record transaction
        await tx.walletTransaction.create({
          data: {
            walletId: user.wallet!.id,
            type: adjustmentAmount > 0 ? 'ADMIN_CREDIT' : 'ADMIN_DEBIT',
            amount: adjustmentAmount,
            balanceAfter: newBalance,
            paymentMethod: 'Admin Adjustment',
            status: 'APPROVED',
            notes: `Admin adjustment by ${currentUser.username}: ${reason}`,
          },
        });

        // Audit log
        await tx.auditLog.create({
          data: {
            adminId: currentUser.id,
            adminName: currentUser.fullName,
            action: adjustmentAmount > 0 ? 'WALLET_ADMIN_CREDIT' : 'WALLET_ADMIN_DEBIT',
            target: userId,
            details: `Adjusted balance for ${user.username} by ৳${adjustmentAmount}. Previous: ৳${currentBalance}, New: ৳${newBalance}. Reason: ${reason}`,
          },
        });

        // Notification
        await tx.notification.create({
          data: {
            userId,
            title: `Wallet Adjusted: ৳${Math.abs(adjustmentAmount)}`,
            message: `Admin adjusted your wallet balance by ${adjustmentAmount > 0 ? '+' : ''}৳${adjustmentAmount}. Reason: ${reason}`,
            type: 'SYSTEM',
          },
        });
      });

      return NextResponse.json({ success: true, newBalance, message: 'Wallet balance adjusted successfully.' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error modifying user:', error);
    return NextResponse.json({ error: error.message || 'Operation failed' }, { status: 500 });
  }
}

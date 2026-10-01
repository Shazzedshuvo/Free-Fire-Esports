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
    const status = searchParams.get('status');
    const query = searchParams.get('query');

    const whereClause: any = {};
    if (status && status !== 'ALL') {
      whereClause.status = status.toUpperCase();
    }

    if (query) {
      whereClause.OR = [
        { transactionId: { contains: query } },
        { senderNumber: { contains: query } },
        { user: { username: { contains: query } } },
        { user: { ffUid: { contains: query } } },
      ];
    }

    const deposits = await prisma.depositRequest.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            ffUid: true,
            mobileNumber: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ deposits });
  } catch (error) {
    console.error('Error fetching admin deposits:', error);
    return NextResponse.json({ error: 'Failed to fetch deposits' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser || !hasAdminAccess(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { depositId, action, reason } = body; // action: "APPROVE" | "REJECT"

    if (!depositId || !action) {
      return NextResponse.json({ error: 'Deposit ID and Action are required.' }, { status: 400 });
    }

    const deposit = await prisma.depositRequest.findUnique({
      where: { id: depositId },
      include: { user: true },
    });

    if (!deposit) {
      return NextResponse.json({ error: 'Deposit request not found.' }, { status: 404 });
    }

    if (deposit.status !== 'PENDING') {
      return NextResponse.json({ error: `Deposit request is already ${deposit.status}.` }, { status: 400 });
    }

    if (action === 'APPROVE') {
      await prisma.$transaction(async (tx) => {
        // 1. Update deposit status
        await tx.depositRequest.update({
          where: { id: depositId },
          data: {
            status: 'APPROVED',
            verifiedBy: `${currentUser.fullName} (${currentUser.role})`,
            verifiedAt: new Date(),
          },
        });

        // 2. Fetch & update user wallet
        const wallet = await tx.wallet.findUnique({
          where: { userId: deposit.userId },
        });

        if (!wallet) throw new Error('User wallet not found');

        const newBalance = wallet.balance + deposit.amount;
        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: newBalance,
            totalDeposited: wallet.totalDeposited + deposit.amount,
          },
        });

        // 3. Create wallet transaction
        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: 'DEPOSIT',
            amount: deposit.amount,
            balanceAfter: newBalance,
            paymentMethod: deposit.method,
            senderNumber: deposit.senderNumber,
            externalTxnId: deposit.transactionId,
            status: 'APPROVED',
            notes: `bKash deposit approved by admin ${currentUser.username}`,
          },
        });

        // 4. Send notification to user
        await tx.notification.create({
          data: {
            userId: deposit.userId,
            title: `Deposit Approved: ৳${deposit.amount}`,
            message: `Your deposit of ৳${deposit.amount} (TrxID: ${deposit.transactionId}) has been approved and credited to your wallet.`,
            type: 'DEPOSIT_APPROVED',
          },
        });

        // 5. Audit log
        await tx.auditLog.create({
          data: {
            adminId: currentUser.id,
            adminName: currentUser.fullName,
            action: 'APPROVE_DEPOSIT',
            target: deposit.id,
            details: `Approved ৳${deposit.amount} deposit for ${deposit.user.username} (TrxID: ${deposit.transactionId})`,
          },
        });
      });

      return NextResponse.json({ success: true, message: `Deposit of ৳${deposit.amount} approved successfully.` });
    } else if (action === 'REJECT') {
      await prisma.$transaction(async (tx) => {
        await tx.depositRequest.update({
          where: { id: depositId },
          data: {
            status: 'REJECTED',
            rejectionReason: reason || 'Invalid or unverified transaction ID.',
            verifiedBy: `${currentUser.fullName} (${currentUser.role})`,
            verifiedAt: new Date(),
          },
        });

        await tx.notification.create({
          data: {
            userId: deposit.userId,
            title: `Deposit Rejected: ৳${deposit.amount}`,
            message: `Your deposit of ৳${deposit.amount} (TrxID: ${deposit.transactionId}) was rejected. Reason: ${reason || 'Transaction could not be verified'}.`,
            type: 'DEPOSIT_REJECTED',
          },
        });

        await tx.auditLog.create({
          data: {
            adminId: currentUser.id,
            adminName: currentUser.fullName,
            action: 'REJECT_DEPOSIT',
            target: deposit.id,
            details: `Rejected deposit for ${deposit.user.username}. Reason: ${reason || 'Unverified'}`,
          },
        });
      });

      return NextResponse.json({ success: true, message: 'Deposit request rejected.' });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error handling deposit verification:', error);
    return NextResponse.json({ error: error.message || 'Deposit action failed' }, { status: 500 });
  }
}

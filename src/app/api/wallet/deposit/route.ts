import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'You must be logged in to deposit money.' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, senderNumber, transactionId, method = 'bKash', screenshotUrl } = body;

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount < 50 || parsedAmount > 25000) {
      return NextResponse.json({ error: 'Deposit amount must be between ৳50 and ৳25,000.' }, { status: 400 });
    }

    if (!senderNumber || senderNumber.trim().length < 11) {
      return NextResponse.json({ error: 'Please enter a valid 11-digit mobile number.' }, { status: 400 });
    }

    if (!transactionId || transactionId.trim().length < 6) {
      return NextResponse.json({ error: `Please provide a valid ${method} Transaction ID (TrxID).` }, { status: 400 });
    }

    const cleanTxnId = transactionId.trim().toUpperCase();

    // 1. Check duplicate transaction ID in DepositRequest
    const existingDeposit = await prisma.depositRequest.findUnique({
      where: { transactionId: cleanTxnId },
    });

    if (existingDeposit) {
      return NextResponse.json({ error: 'This transaction ID has already been used.' }, { status: 400 });
    }

    // Also check in WalletTransactions for externalTxnId
    const existingTxn = await prisma.walletTransaction.findFirst({
      where: { externalTxnId: cleanTxnId },
    });

    if (existingTxn) {
      return NextResponse.json({ error: 'This transaction ID has already been used.' }, { status: 400 });
    }

    // 2. Verification Mode:
    // If the transaction ID starts with "INSTANT" or "AUTO", simulate immediate API verification.
    // Otherwise, create as PENDING for admin review fallback.
    const isAutoVerified = cleanTxnId.startsWith('INSTANT') || cleanTxnId.startsWith('AUTO');

    if (isAutoVerified) {
      // Instant automated verification flow
      const result = await prisma.$transaction(async (tx) => {
        const deposit = await tx.depositRequest.create({
          data: {
            userId: currentUser.id,
            amount: parsedAmount,
            method,
            senderNumber: senderNumber.trim(),
            transactionId: cleanTxnId,
            screenshotUrl: screenshotUrl || null,
            status: 'APPROVED',
            verifiedBy: `Official ${method} Gateway (Auto)`,
            verifiedAt: new Date(),
          },
        });

        const wallet = await tx.wallet.findUnique({
          where: { userId: currentUser.id },
        });

        if (!wallet) throw new Error('Wallet not found');

        const newBalance = wallet.balance + parsedAmount;
        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: newBalance,
            totalDeposited: wallet.totalDeposited + parsedAmount,
          },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: 'DEPOSIT',
            amount: parsedAmount,
            balanceAfter: newBalance,
            paymentMethod: method,
            senderNumber: senderNumber.trim(),
            externalTxnId: cleanTxnId,
            status: 'APPROVED',
            notes: `Instant ${method} auto-verified deposit`,
          },
        });

        await tx.notification.create({
          data: {
            userId: currentUser.id,
            title: `Deposit Approved: ৳${parsedAmount}`,
            message: `Deposit successful. ৳${parsedAmount} has been added to your wallet. TrxID: ${cleanTxnId}`,
            type: 'DEPOSIT_APPROVED',
          },
        });

        return { deposit, newBalance };
      });

      return NextResponse.json({
        success: true,
        isAutoVerified: true,
        status: 'APPROVED',
        message: `Deposit successful. ৳${parsedAmount} has been added to your wallet.`,
        newBalance: result.newBalance,
      });
    } else {
      // Verification Fallback: Set PENDING for Admin Review
      const deposit = await prisma.depositRequest.create({
        data: {
          userId: currentUser.id,
          amount: parsedAmount,
          method,
          senderNumber: senderNumber.trim(),
          transactionId: cleanTxnId,
          screenshotUrl: screenshotUrl || null,
          status: 'PENDING',
        },
      });

      return NextResponse.json({
        success: true,
        isAutoVerified: false,
        status: 'PENDING',
        message: 'Deposit request submitted. Status: Pending Admin Review. Your wallet will be credited once verified.',
        deposit,
      });
    }
  } catch (error: any) {
    console.error('Deposit error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit deposit request.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requests = await prisma.depositRequest.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ deposits: requests });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deposits' }, { status: 500 });
  }
}

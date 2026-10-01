import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Please login to withdraw funds.' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, method, accountNumber } = body;
    const withdrawAmount = Number(amount);

    if (!withdrawAmount || withdrawAmount < 50) {
      return NextResponse.json({ error: 'Minimum withdrawal amount is ৳50.' }, { status: 400 });
    }

    if (!accountNumber || accountNumber.trim().length < 11) {
      return NextResponse.json({ error: 'Valid 11-digit mobile wallet number is required.' }, { status: 400 });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: currentUser.id },
    });

    if (!wallet || wallet.balance < withdrawAmount) {
      return NextResponse.json({ error: 'Insufficient balance in your wallet.' }, { status: 400 });
    }

    // Deduct balance and record transaction
    const newBalance = wallet.balance - withdrawAmount;

    const [updatedWallet, transaction] = await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: newBalance,
        },
      }),
      prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'WITHDRAWAL',
          amount: -withdrawAmount,
          balanceAfter: newBalance,
          paymentMethod: method || 'bKash',
          senderNumber: accountNumber.trim(),
          status: 'PENDING',
          notes: `Withdrawal request to ${accountNumber.trim()} via ${method || 'bKash'}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully! Funds will be sent to your account.',
      balance: updatedWallet.balance,
      transaction,
    });
  } catch (error: any) {
    console.error('Withdraw error:', error);
    return NextResponse.json({ error: 'Failed to process withdrawal request.' }, { status: 500 });
  }
}

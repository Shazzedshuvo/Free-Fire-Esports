import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      username,
      ffPlayerName,
      ffUid,
      mobileNumber,
      email,
      password,
    } = body;

    if (!fullName || !username || !ffPlayerName || !ffUid || !mobileNumber || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    // Check duplicate email
    const existingEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingEmail) {
      return NextResponse.json({ error: 'Email is already registered.' }, { status: 400 });
    }

    // Check duplicate username
    const existingUsername = await prisma.user.findUnique({
      where: { username: username.trim() },
    });
    if (existingUsername) {
      return NextResponse.json({ error: 'Username is already taken.' }, { status: 400 });
    }

    // Check duplicate Free Fire UID
    const existingUid = await prisma.user.findUnique({
      where: { ffUid: ffUid.trim() },
    });
    if (existingUid) {
      return NextResponse.json({ error: 'This Free Fire UID is already linked to another account.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    // Create user and initial wallet in a transaction
    const newUser = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        username: username.trim(),
        ffPlayerName: ffPlayerName.trim(),
        ffUid: ffUid.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: 'USER',
        wallet: {
          create: {
            balance: 0.0,
            totalDeposited: 0.0,
            totalWon: 0.0,
            totalEntryFees: 0.0,
          },
        },
      },
      include: {
        wallet: true,
      },
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      username: newUser.username,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        username: newUser.username,
        ffPlayerName: newUser.ffPlayerName,
        ffUid: newUser.ffUid,
        mobileNumber: newUser.mobileNumber,
        email: newUser.email,
        role: newUser.role,
        wallet: newUser.wallet,
      },
    });

    response.cookies.set('ff_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Server error occurred during registration.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { emailOrUsername, password } = body;

    if (!emailOrUsername || !password) {
      return NextResponse.json({ error: 'Please enter your email/username and password.' }, { status: 400 });
    }

    const cleanInput = emailOrUsername.trim();
    const identifier = cleanInput.toLowerCase().replace(/\s+/g, '');
    
    // Check possible aliases for admin if entered with variation
    const emailQueries = [{ email: identifier }, { username: cleanInput }];
    if (identifier === 'admin@123.gmail.com') {
      emailQueries.push({ email: 'admni@123.gmail.com' });
    } else if (identifier === 'admni@123.gmail.com') {
      emailQueries.push({ email: 'admin@123.gmail.com' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: emailQueries,
      },
      include: {
        wallet: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid login credentials.' }, { status: 401 });
    }

    if (user.isSuspended) {
      return NextResponse.json({ error: 'Your account has been suspended by an administrator.' }, { status: 403 });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid login credentials.' }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        ffPlayerName: user.ffPlayerName,
        ffUid: user.ffUid,
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: user.role,
        wallet: user.wallet,
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
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error during login.' }, { status: 500 });
  }
}

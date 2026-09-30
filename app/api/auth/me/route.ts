import { NextResponse } from 'next/server';
import { getSession, createSession } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export async function GET(req?: Request) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!dbUser) {
    return NextResponse.json({ authenticated: true, user: session });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      userId: dbUser.id,
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      createdAt: dbUser.createdAt,
    },
  });
}

export async function PATCH(req: Request) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';

    if (!name) {
      return NextResponse.json({ success: false, error: 'Name cannot be empty' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: { name },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    await createSession({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    });

    return NextResponse.json({
      success: true,
      user: {
        userId: updatedUser.id,
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to update profile' }, { status: 500 });
  }
}

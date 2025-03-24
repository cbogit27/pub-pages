// app/api/posts/public/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit')) || 3;

  try {
    const posts = await prisma.post.findMany({
      take: limit,
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            profile: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Posts fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// app/api/search/suggestions/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  try {
    const suggestions = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } }
        ],
        published: true // Only search published posts if you have this field
      },
      select: {
        id: true,
        title: true,
        category: {
          select: {
            name: true
          }
        }
      },
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
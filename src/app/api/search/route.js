// app/api/search/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q'); // Get the 'q' query parameter

  try {
    const posts = await prisma.post.findMany({
      where: {
        title: { contains: q, mode: 'insensitive' }, // Search by title only
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
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

    return NextResponse.json(posts); // Return the search results as JSON
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
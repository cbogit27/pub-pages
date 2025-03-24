// File: /app/api/authors/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const id = params.id;
  
  try {
    // Get user by ID with their profile
    const author = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,  // Include the profile to get bio
      }
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(author);
  } catch (error) {
    console.error('Author fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch author' },
      { status: 500 }
    );
  }
}
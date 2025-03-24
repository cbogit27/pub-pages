import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('API: Fetching profile for userId:', userId);

    if (!userId) {
      console.log('API: No userId provided');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch the user and their profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true, // Include the user's profile
      },
    });

    if (!user) {
      console.log('API: User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('API: User and profile found:', user);

    // Return combined data
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      bio: user.profile?.bio || null,
      avatar: user.profile?.avatar || null,
    });
  } catch (error) {
    console.error('API: Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile: ' + error.message },
      { status: 500 }
    );
  }
}
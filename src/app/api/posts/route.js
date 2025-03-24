import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handleError = (message, status = 500) => {
  console.error(`Error [${status}]: ${message}`);
  return NextResponse.json(
    { success: false, error: message.toString() },
    { status, headers: { 'Content-Type': 'application/json' } }
  );
};

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) return handleError('Authentication required', 401);
    if (session.user.role !== 'ADMIN') return handleError('Admin privileges required', 403);

    const formData = await request.formData();

    // Validate required fields
    const requiredFields = {
      title: 'Title is required',
      categoryId: 'Category is required',
      content: 'Content is required',
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !formData.get(field))
      .map(([_, message]) => message);

    if (missingFields.length > 0) {
      return handleError(missingFields.join(', '), 400);
    }

    // Process form data
    const title = formData.get('title').toString().trim();
    const categoryId = Number(formData.get('categoryId'));
    const content = formData.get('content').toString().trim();
    const imageFile = formData.get('image');

    if (isNaN(categoryId)) return handleError('Invalid category ID', 400);

    // Check category existence
    const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!categoryExists) return handleError('Category not found', 404);

    // Generate slug
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60);

    // Check existing slugs
    const existingPost = await prisma.post.findFirst({
      where: { OR: [{ slug }, { oldSlugs: { has: slug } }] },
    });
    if (existingPost) return handleError('Title already exists', 400);

    // Handle image upload
    let imageUrl = '';
    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        const buffer = await imageFile.arrayBuffer();
        const uploadResult = await cloudinary.uploader.upload(
          `data:${imageFile.type};base64,${Buffer.from(buffer).toString('base64')}`,
          { folder: 'blog-uploads' }
        );
        imageUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return handleError('Image upload failed', 500);
      }
    }

    // Create post
    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        image: imageUrl,
        categoryId,
        authorId: session.user.id,
        description: formData.get('description')?.toString().trim() || '',
        published: formData.get('published') === 'true',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: true, // Include the author's profile
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, post: newPost },
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Server error:', error);
    return handleError(error instanceof Error ? error.message : 'Unknown error occurred');
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    const posts = await prisma.post.findMany({
      where: session?.user ? {} : { published: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: true, // Include the author's profile
          },
        },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const response = NextResponse.json(posts);
    if (!session?.user) {
      response.headers.set('Cache-Control', 'public, s-maxage=10');
    }
    return response;
  } catch (error) {
    console.error('Fetch posts error:', error);
    return handleError('Failed to load posts');
  }
}
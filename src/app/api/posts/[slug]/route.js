import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import slugify from 'slugify';
import { adminOnly } from '@/lib/authMiddleware';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = 'force-dynamic';

const errorResponse = (message, status = 500) => {
  return NextResponse.json({ error: message }, { status });
};

const parseRequestBody = async (request) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return await request.json();
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      return Object.fromEntries(formData.entries());
    }
    return null;
  } catch (error) {
    console.error('Parsing error:', error);
    return null;
  }
};

const generateSlug = (title) => {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
};

// GET handler
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const post = await prisma.post.findFirst({
      where: { OR: [{ slug }, { oldSlugs: { has: slug }}] },
      include: {
        author: { select: { id: true, name: true, email: true, image: true, profile: true } },
        category: { select: { name: true } },
      },
    });
    if (!post) return errorResponse('Post not found', 404);
    if (post.slug !== slug) {
      return NextResponse.redirect(new URL(`/posts/${post.slug}`, request.nextUrl.origin), { status: 301 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error('Fetch error:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

// PUT handler
export const PUT = adminOnly(async (request, { params }) => {
  try {
    const { slug } = params;
    const body = await parseRequestBody(request);
    if (!body) return errorResponse('Invalid request format', 400);

    const currentPost = await prisma.post.findUnique({
      where: { slug },
      select: { id: true, title: true, slug: true, oldSlugs: true }
    });
    if (!currentPost) return errorResponse('Post not found', 404);

    const updateData = {
      content: body.content?.trim(),
      description: body.description?.trim(),
      categoryId: body.categoryId ? Number(body.categoryId) : undefined,
      published: body.published !== undefined ? body.published === 'true' : undefined,
    };

    // Handle title change
    if (body.title?.trim()) {
      const newTitle = body.title.trim();
      const newSlug = generateSlug(newTitle);
      
      // Check for slug conflict only if slug would change
      if (newSlug !== currentPost.slug) {
        const existingPost = await prisma.post.findFirst({
          where: {
            slug: newSlug,
            NOT: { id: currentPost.id } // Exclude current post
          }
        });
        if (existingPost) {
          return errorResponse('A post with this title already exists. Please choose a different title.', 409);
        }
        updateData.title = newTitle;
        updateData.slug = newSlug;
        updateData.oldSlugs = { set: [...currentPost.oldSlugs, currentPost.slug] };
      }
    }

    // Handle image upload
    if (body.image) {
      try {
        const imageFile = body.image instanceof File ? body.image : null;
        if (imageFile) {
          const buffer = Buffer.from(await imageFile.arrayBuffer());
          const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
          const uploadResult = await cloudinary.uploader.upload(base64Image, {
            folder: 'blog-uploads'
          });
          updateData.image = uploadResult.secure_url;
        } else {
          updateData.image = body.image;
        }
      } catch (error) {
        console.error('Image upload error:', error);
        return errorResponse('Image upload failed', 400);
      }
    }

    const updatedPost = await prisma.post.update({
      where: { slug },
      data: updateData,
      include: { author: { select: { id: true, name: true, profile: true } } }
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Update error:', error);
    return errorResponse(error.message || 'Error updating post');
  }
});

// DELETE handler
export const DELETE = adminOnly(async (request, { params }) => {
  try {
    const { slug } = params;
    const deletedPost = await prisma.post.delete({ where: { slug } });
    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
      deletedSlug: deletedPost.slug
    });
  } catch (error) {
    console.error('Deletion error:', error);
    return errorResponse(error.message || 'Error deleting post');
  }
});
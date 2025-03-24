import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import slugify from 'slugify';
import { adminOnly } from '@/lib/authMiddleware';

// Configure Cloudinary
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
    
    if (contentType.includes('application/json')) {
      return await request.json();
    }
    
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

const handleSlugConflict = async (slug) => {
  const existingPost = await prisma.post.findUnique({
    where: { slug },
    select: { id: true }
  });
  return !!existingPost;
};

// Unified PUT handler with slug management
export const PUT = adminOnly(async (req, { params }) => {
  try {
    const { slug } = await params;
    if (!slug) return errorResponse('Missing post identifier', 400);

    const session = await getServerSession(authOptions);
    if (!session) return errorResponse('Unauthorized', 401);

    const body = await parseRequestBody(request);
    if (!body) return errorResponse('Invalid request format', 400);

    // Validate required fields
    if (!body.title?.trim()) return errorResponse('Title is required', 400);
    if (!body.content?.trim()) return errorResponse('Content is required', 400);


    // Simplified slug handling for edits
  const generateSlug = (title, existingSlug) => {
    if (existingSlug) {
      const currentTitleSlug = slugify(title, { lower: true, strict: true });
      return currentTitleSlug === existingSlug ? existingSlug : currentTitleSlug;
    }
    return slugify(title, { lower: true, strict: true });
  };

    // Get current post data
    const currentPost = await prisma.post.findUnique({
      where: { slug },
      select: { title: true, slug: true}
    });

    

    if (!currentPost) return errorResponse('Post not found', 404);

    // Generate new slug if title changes
    const newTitle = body.title.trim();
    const newSlug = generateSlug(newTitle, currentPost.slug);
    const slugChanged = newSlug !== currentPost.slug;

// Handle slug conflict only if slug changed
    if (slugChanged) {
    const slugExists = await prisma.post.findFirst({
      where: { OR: [{ slug: newSlug }, { oldSlugs: { has: newSlug } }] }
    });
    if (slugExists) return errorResponse('Title already exists', 409);
    }

    // Process image upload
    let imageUrl = body.image;
    const imageFile = body.image instanceof File ? body.image : null;

    if (imageFile) {
      try {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
        const uploadResult = await cloudinary.uploader.upload(base64Image, {
          folder: 'blog-uploads'
        });
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return errorResponse('Image upload failed', 400);
      }
    }

    // Prepare update data
    const updateData = {
      title: newTitle,
      content: body.content.trim(),
      ...(slugChanged && { 
        slug: newSlug,
        oldSlugs: { set: [...currentPost.oldSlugs, currentPost.slug] }
      }),
      description: body.description?.trim() || '',
      categoryId: body.categoryId ? Number(body.categoryId) : undefined,
      authorId: body.authorId?.toString(),
      published: body.published ? body.published === 'true' : undefined,
      ...(imageUrl && { image: imageUrl })
    };

    // Update post
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: true // Include the author's profile
          }
        }
      }
    });

    return NextResponse.json({
      ...updatedPost,
      slugChanged,
      newSlug: slugChanged ? newSlug : null
    });

  } catch (error) {
    console.error('Update error:', error);
    if (error.code === 'P2002') {
      return errorResponse('Slug conflict detected', 409);
    }
    return errorResponse(error.message || 'Error updating post');
  }
}

);
// Enhanced GET handler with slug redirection
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: 'Missing post identifier' }, { status: 400 });

    const post = await prisma.post.findFirst({
      where: {
        OR: [
          { slug },
          { oldSlugs: { has: slug } }
        ]
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profile: true,
          },
        },
        category: { select: { name: true } },
      },
    });

    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    // Redirect to current slug if accessed via old slug
    if (post.slug !== slug) {
      return NextResponse.redirect(
        new URL(`/posts/${post.slug}`, process.env.NEXTAUTH_URL),
        { status: 301 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE handler remains similar but with slug history cleanup
export const DELETE = adminOnly(async (req, { params }) => {
  try {
    const { slug } = await params;
    if (!slug) return errorResponse('Missing post identifier', 400);

    const session = await getServerSession(authOptions);
    if (!session) return errorResponse('Unauthorized', 401);

    const deletedPost = await prisma.post.delete({
      where: { slug }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Post deleted permanently',
      deletedSlug: deletedPost.slug,
      affectedOldSlugs: deletedPost.oldSlugs
    });

  } catch (error) {
    console.error('Deletion error:', error);
    return errorResponse(error.message || 'Error deleting post');
  }
})
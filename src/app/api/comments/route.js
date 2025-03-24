import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { authenticatedOnly } from '@/lib/authMiddleware';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId) },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(comments);

  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json(
      { error: 'Failed to load comments' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return errorResponse('Unauthorized', 401);

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');
    
    if (!commentId) return errorResponse('Comment ID required', 400);

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) return errorResponse('Comment not found', 404);

    if (session.user.role !== 'ADMIN' && comment.authorId !== session.user.id) {
      return errorResponse('Unauthorized', 403);
    }

    const [childrenResult, parentResult] = await prisma.$transaction([
      prisma.comment.deleteMany({ where: { parentId: commentId } }),
      prisma.comment.delete({ where: { id: commentId } })
    ]);

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
      deletedComment: commentId,
      childCommentsDeleted: childrenResult.count
    });

  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete comment' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    
    // Validate required fields
    if (!body.content?.trim()) return errorResponse('Content is required', 400);
    if (!body.postId) return errorResponse('Post ID is required', 400);

    const newComment = await prisma.comment.create({
      data: {
        content: body.content,
        postId: body.postId,
        parentId: body.parentId,
        authorId: session.user.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(newComment, { status: 201 });

  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create comment' },
      { status: 500 }
    );
  }
}
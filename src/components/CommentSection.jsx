"use client";
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import CommentForm from './CommentForm';
import Comment from './Comment';

export default function CommentSection({ postId }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await fetch(`/api/comments?postId=${postId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load comments');
        }

        const data = await response.json();
        setComments(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error('Failed to load comments:', error);
        setError(error.message);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadComments();
  }, [postId]);

  const handleNewComment = (newComment) => {
    if (!newComment?.id) {
      console.error('Invalid comment data received:', newComment);
      return;
    }
    
    setComments(prev => [{
      ...newComment,
      // Add default values for safety
      children: [],
      author: newComment.author || { name: 'Unknown User' }
    }, ...prev]);
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500">
        Loading comments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg mb-6">
        <p className="text-red-600">Error loading comments: {error}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">
        Comments ({comments.length})
      </h2>

      {session ? (
        <CommentForm postId={postId} onSuccess={handleNewComment} />
      ) : (
        <div className="bg-blue-500/40 p-4 rounded-lg mb-6">
          <p className="text-blue-800">
            Please{' '}
            <button
              onClick={() => signIn('google')}
              className="text-blue-600 hover:underline font-medium"
            >
              sign in with Google
            </button>{' '}
            to comment
          </p>
        </div>
      )}

      <div className="space-y-6 mt-6">
        {comments.length === 0 ? (
          <div className="text-center text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map(comment => (
            <Comment 
              key={comment.id} 
              comment={comment}
              onDelete={() => setComments(prev => 
                prev.filter(c => c.id !== comment.id)
              )}
            />
          ))
        )}
      </div>
    </div>
  );
}
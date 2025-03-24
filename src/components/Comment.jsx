"use client";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import CommentForm from './CommentForm';

export default function Comment({ comment, onDelete }) {
  const [showReply, setShowReply] = useState(false);
  const { data: session } = useSession();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const response = await fetch(`/api/comments?id=${comment.id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete comment');
        }
        
        onDelete();
      } catch (error) {
        console.error('Delete error:', error);
        alert(error.message);
      }
    }
  };

  if (!comment?.id) return null;

  return (
    <div className="border-l-2 pl-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <img 
            src={comment.author?.image || '/default-avatar.png'} 
            alt={comment.author?.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h4 className="text-xs font-medium">
              {comment.author?.name || 'Anonymous'}
            </h4>
             <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {(session?.user.role === 'ADMIN' || session?.user.id === comment.authorId) && (
          <button 
            onClick={handleDelete}
            className="text-red-500/40 hover:text-red-700/40 text-xs"
          >
            Delete
          </button>
        )}
      </div>
      
      <p className="text-gray-700 mb-2 text-sm">{comment.content}</p>
      
      <button
        onClick={() => setShowReply(!showReply)}
        className="text-blue-500 hover:text-blue-700 text-xs"
      >
        {showReply ? 'Cancel Reply' : 'Reply'}
      </button>
      
      {showReply && (
        <div className="mt-4 ml-4">
          <CommentForm 
            postId={comment.postId} 
            parentId={comment.id} 
            onSuccess={() => setShowReply(false)}
          />
        </div>
      )}
      
      {comment.children?.map(child => (
        <Comment 
          key={child.id} 
          comment={child}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
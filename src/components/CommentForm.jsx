"use client";
import { useState } from 'react';

export default function CommentForm({ postId, parentId, onSuccess }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          parentId,
          content: content.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post comment');
      }

      const newComment = await response.json();
      onSuccess(newComment); // Ensure this contains the full comment data
      setContent('');

    } catch (error) {
      console.error('Comment submission error:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        className="w-full p-2 border text-gray-200 text-sm bg-blue-600/50"
        rows="3"
        disabled={isSubmitting}
      />
      <div className="mt-2 flex justify-end gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-700/40 text-sm text-white active:bg-transparent active:border border-gray-200/40 disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}
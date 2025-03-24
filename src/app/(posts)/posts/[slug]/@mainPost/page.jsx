"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import CommentSection from "@/components/CommentSection";

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`);
        if (!response.ok) throw new Error("Post not found");
        setPost(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <article className="max-w-4xl mx-auto px-4">
      <header className="mb-8">
        <div className="flex items-center gap-2 md:gap-4 text-xs text-gray-600">
          <span>{post.author?.name}</span>
          <span>•</span>
          <span>{format(new Date(post.createdAt), "MMM dd, yyyy")}</span>
          <span>•</span>
          <span className="bg-gray-100 px-2 py-1 rounded">{post.category?.name}</span>
        </div>
      </header>

      {post.image && (
        <div className="relative h-48 md:h-64 lg:h-96 mb-8">
          {/* Blog Image */}
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover rounded"
            priority
          />

          {/* Title Overlay */}
          <div className="absolute bottom-4 left-0 w-full p-4">
            <h1 className="text-white text-2xl md:text-4xl font-extrabold bg-gray-700/80 p-2 rounded">
              {post.title}
            </h1>
          </div>
        </div>
      )}

      <div className="prose max-w-none mb-12">
        {post.description && (
          <p className="text-md md:text-lg font-semibold text-gray-500 mb-6">
            {post.description}
          </p>
        )}
        <div
          className="text-sm md:text-md font-normal text-gray-600"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <CommentSection postId={post.id} />
    </article>
  );
}
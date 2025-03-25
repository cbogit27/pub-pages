"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import OtherPostsSkeleton from './OtherPostSkelecton';

export default function OtherPosts({ currentPostId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts?limit=3');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data.filter(post => post.id !== currentPostId));
      } catch (error) {
        console.error('Posts fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPostId]);

  if (loading) return <OtherPostsSkeleton count={1}/>;

  return (
    <div className="space-y-8">
      {posts.map(post => (
        <Link
          key={post.id}
          href={`/posts/${post.slug}`}
          className="block hover:underline underline-offset-2 cursor-pointer"
        >
          <div className="flex gap-4">
            {post.image && (
              <Image
                src={post.image}
                alt={post.title}
                width={100}
                height={50}
                className="object-cover "
                priority
              />
            )}
            <div>
              <h3 className="font-light text-sm line-clamp-3">{post.title}</h3>
              {/* <p className="text-sm text-gray-600">
                By {post.author.name}
              </p> */}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
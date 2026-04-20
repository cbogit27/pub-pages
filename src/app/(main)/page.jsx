"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion"
import PulseLoader from "@/components/PulseLoader";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaderCount, setLoaderCount] = useState(1);
  const [error, setError] = useState(null);
  const [yBottom] = useState(600)
  const [yTop] = useState(-600)

  useEffect(() => {
    const savedPostCount = Number(window.localStorage.getItem("homePostCount"));
    if (savedPostCount > 0) {
      setLoaderCount(savedPostCount);
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts/public");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
        setLoaderCount(data.length || 1);
        window.localStorage.setItem("homePostCount", String(data.length || 1));
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <PulseLoader count={loaderCount} />
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-8">
      <h1
      
      className="text-3xl font-bold uppercase my-8 md:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-br from-gray-600 to-gray-900">Latest Posts</h1>
      {posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No posts available yet.</p>
        </div>
      ) : (
        <div        
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
          {posts.map((post) => (
            <Link 
              href={`/posts/${post.slug}`} 
              key={post.id} 
              className="rounded shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <article
              >
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <div className="p-4 space-y-8">
                  <p className="text-xs font-light text-gray-500 mb-2">
                    {format(new Date(post.createdAt), "MMM dd, yyyy")}
                  </p>
                  <h2
                  
                  className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">{post.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="text-xs font-light">By {post.author?.name}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {post.category?.name}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

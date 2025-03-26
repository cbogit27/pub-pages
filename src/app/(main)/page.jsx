"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion"

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [yBottom] = useState(600)
  const [yTop] = useState(-600)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts/public");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
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
      <div className="flex justify-center items-center min-h-screen">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-12 w-12 border-4 border-slate-800 rounded-full animate-spin border-t-slate-600"></div>
      </div>
    </div>

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
      <motion.h1
      initial={{ y:yTop}}
      animate={{ y: 1 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{  type: "spring", delay: 1,duration: 3.5,opacity: 1,
      layout: { duration: 1 } }}
      className="text-3xl font-bold uppercase my-8 md:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-br from-gray-600 to-gray-900">Latest Posts</motion.h1>
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
              <motion.article
              initial={{ y:yBottom}}
              animate={{ y: 1 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{  type: "spring", delay: 1,duration: 3.5,opacity: 1,
              layout: { duration: 1.5 } }}>
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
              </motion.article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
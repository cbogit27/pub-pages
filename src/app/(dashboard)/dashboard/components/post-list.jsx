"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import { IoAddCircleOutline, IoPencil } from "react-icons/io5";
import DeletePostButton from "./DeletePostButton";

export default function PostsListPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchPosts();
  }, [session]);

  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-12 w-12 border-4 border-slate-800 rounded-full animate-spin border-t-transparent"></div>
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
    <div className="py-8">
      <div className="flex items-center justify-between mb-8 border-b-2 border-gray-500 py-4">  
        <h1 className="text-3xl font-bold uppercase">Dashboard</h1>
        <Link href="/dashboard/post/add" className="text-base font-light group">
          <div className="flex gap-2 items-end cursor-pointer group-hover:text-zinc-400">
            <IoAddCircleOutline size={25}/>
            <h3 className="text-lg">add post</h3>
          </div>
        </Link>
      </div>
      {posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No posts available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="relative rounded shadow-md overflow-hidden">
              {/* Status Badge */}
              <div className="absolute top-2 right-2 z-10">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>

              <Link href={`/posts/${post.slug}`}>
                <article>
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-2">
                      {format(new Date(post.createdAt), "MMM dd, yyyy")}
                    </p>
                    <h2 className="text-xl font-semibold mb-2 line-clamp-1">{post.title}</h2>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="text-xs font-light">By {post.author?.name}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {post.category?.name}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>

              {/* Edit/Delete buttons */}
              <div className="p-4 border-t flex justify-end gap-3">
                <Link
                  href={`/dashboard/post/edit/${post.slug}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <IoPencil size={20} />
                </Link>
                <DeletePostButton slug={post.slug} onDelete={fetchPosts} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
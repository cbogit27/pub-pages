// app/search/page.js
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q"); // Get the 'q' query parameter
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return; // Only fetch results if 'q' is present

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`/api/search?q=${q}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [q]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-br from-gray-600 to-gray-900">Search Results</h1>
      {loading ? (
        <p>Loading...</p>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}
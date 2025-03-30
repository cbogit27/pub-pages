// src/app/(search)/search/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import { Spinner } from "@/components/SearchSpinner"; // Named import
// OR if you prefer default import:
// import Spinner from "@/components/SearchSpinner";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        
        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error("Search error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [q]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-br from-gray-600 to-gray-900">
        {q ? `Search Results for "${q}"` : 'Search'}
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner size="lg" />
          <span className="sr-only">Loading search results...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          Error: {error}
        </div>
      ) : !q ? (
        <div className="text-gray-500">
          Enter a search term to find posts
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-gray-500">
          No posts found matching your search.
        </div>
      )}
    </div>
  );
}
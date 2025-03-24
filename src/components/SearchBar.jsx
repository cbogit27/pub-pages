// components/SearchBar.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to toggle search input
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    if (query) searchParams.set("q", query);
    router.push(`/search?${searchParams.toString()}`);
    setIsSearchOpen(false); // Close the search input after submission
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setQuery(""); // Clear the search input when toggling
  };

  return (
    <div className="relative">
      {/* Search Icon */}
      {!isSearchOpen && (
        <button onClick={toggleSearch} className="p-2">
          <CiSearch size={20} className="cursor-pointer" />
        </button>
      )}

      {/* Search Input and Button */}
      {isSearchOpen && (
        <div className="absolute top-12 right-0 bg-slate-300 shadow-lg rounded-full">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div
              
              className="text-white py-4 px-2"
            >
              <CiSearch size={30} />
            </div>
            <input
              type="text" 
              placeholder="Search posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="py-2 bg-slate-300 text-gray-800 outline-none w-80 md:w-96"
            />
            {/* Search Button */}
            
            {/* Close Button (X) */}
            <button
              type="button"
              onClick={toggleSearch}
              className="p-4 text-gray-600 hover:text-gray-900"
            >
              <RxCross2 size={30} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
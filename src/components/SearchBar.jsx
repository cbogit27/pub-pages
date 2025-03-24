"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    if (query) searchParams.set("q", query);
    router.push(`/search?${searchParams.toString()}`);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setQuery(""); // Reset search field when toggling
  };

  return (
    <div className="relative">
      {/* Search Icon (Opens Search) */}
      {!isSearchOpen && (
        <button 
          onClick={toggleSearch} 
          className="p-2 focus:outline-none"
          aria-label="Open search"
        >
          <CiSearch size={22} className="cursor-pointer text-gray-700" />
        </button>
      )}

      {/* Search Input & Close Button */}
      {isSearchOpen && (
        <div className="absolute top-10 right-0 bg-white shadow-lg rounded-full flex items-center border border-gray-300 w-80 md:w-96 p-2">
          <CiSearch size={22} className="text-gray-500 ml-3" />
          <form onSubmit={handleSearch} className="flex flex-1">
            <input
              type="text"
              placeholder="Search posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-gray-800 outline-none flex-1 px-2 py-1"
              autoComplete="on"
            />
          </form>
          <button
            type="button"
            onClick={toggleSearch}
            className="p-2 mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            aria-label="Close search"
          >
            <RxCross2 size={22} />
          </button>
        </div>
      )}
    </div>
  );
}

// app/components/SearchBar.js
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  const fetchSuggestions = useCallback(async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching suggestions for:", searchTerm); // Debug log
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received suggestions:", data); // Debug log
      setSuggestions(data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setError(err.message);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    if (query.trim().length > 1) {
      timeoutRef.current = setTimeout(() => {
        fetchSuggestions(query);
      }, 300);
    } else {
      setSuggestions([]);
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, fetchSuggestions]);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      closeSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    router.push(`/search?q=${encodeURIComponent(suggestion.title)}`);
    closeSearch();
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setQuery("");
      setSuggestions([]);
      setError(null);
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSuggestions([]);
    setError(null);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        closeSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Search Icon */}
      {!isSearchOpen && (
        <button
          onClick={toggleSearch}
          className="p-2 focus:outline-none"
          aria-label="Open search"
        >
          <CiSearch size={22} className="cursor-pointer text-gray-700 hover:text-gray-900" />
        </button>
      )}

      {/* Search Input */}
      {isSearchOpen && (
        <div className="relative">
          <div className="absolute top-10 right-0 bg-white shadow-lg rounded-full flex items-center border border-gray-200 w-80 md:w-96 p-2 z-10">
            <form onSubmit={handleSearch} className="flex items-center w-full">
              <CiSearch size={22} className="text-gray-500 ml-2" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent text-gray-800 outline-none flex-1 px-3 py-1 w-full"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close search"
              >
                <RxCross2 size={18} />
              </button>
            </form>
          </div>

          {/* Suggestions Dropdown */}
          {(query.length > 1 && (isLoading || suggestions.length > 0 || error)) && (
            <div className="absolute top-20 right-0 w-80 md:w-96 bg-white shadow-lg rounded-lg z-20 max-h-60 overflow-y-auto border border-gray-200">
              {isLoading ? (
                <div className="p-3 text-gray-500 flex items-center gap-2">
                  <span className="animate-pulse">Loading suggestions...</span>
                </div>
              ) : error ? (
                <div className="p-3 text-red-500">{error}</div>
              ) : suggestions.length > 0 ? (
                <>
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="font-medium text-gray-800">{suggestion.title}</div>
                      {suggestion.category && (
                        <div className="text-xs text-gray-500 mt-1">
                          in {suggestion.category.name}
                        </div>
                      )}
                    </div>
                  ))}
                  <div 
                    className="p-3 text-sm text-blue-600 hover:bg-gray-50 cursor-pointer border-t border-gray-100"
                    onClick={handleSearch}
                  >
                    Search for "{query}"
                  </div>
                </>
              ) : (
                <div className="p-3 text-gray-500">No suggestions found</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
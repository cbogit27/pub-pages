// components/Header.js
"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isActiveLink = (href) => pathname === href;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="flex items-center justify-between py-4 relative">
      {/* Logo Section */}
      <div>
        <Link href={"/"} className="text-md cursor-pointer">
          Six O'Clock
        </Link>
        <span className="text-xs font-light hidden md:flex">
          - before your morning cup
        </span>
      </div>

      {/* Navigation and User Section */}
      <div className="flex items-center space-x-2 md:space-x-6">
        {/* Navigation Links */}
        <Link
          href="/about"
          className="uppercase text-xs font-light cursor-pointer hover:bg-gray-700/40 rounded-none px-2 md:px-4 py-2"
        >
          About
        </Link>

        {/* Auth Section */}
        <div className="flex items-center">
          {session ? (
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Only show Dashboard for Admins */}
              {session.user.role === "ADMIN" && (
                <Link
                  href="/dashboard"
                  className={`text-xs cursor-pointer uppercase hover:bg-gray-700/40 rounded-none px-2 md:px-4 py-2 ${
                    isActiveLink("/dashboard") ? "bg-gray-700/40 w-fit" : ""
                  }`}
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs uppercase font-light hover:text-gray-600/30 px-2 md:px-4 py-2"
              >
                Sign Out
              </button>
              <div className="flex flex-col space-y-2 items-center">
                <img
                  src={session.user.image || "/default-avatar.png"}
                  alt={session.user.name}
                  className="h-6 w-6 rounded-full"
                />
              </div>
            </div>
          ) : (
            // Show Sign In only when not logged in
            !session && (
              <Link
                href="/signin"
                className="cursor-pointer text-xs uppercase font-light px-2 md:px-4 py-2"
              >
                Sign In
              </Link>
            )
          )}
        </div>

        {/* Search Bar */}
        <div className="flex items-center">
          <SearchBar categories={categories} />
        </div>
      </div>
    </nav>
  );
}
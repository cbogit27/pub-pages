// app/(auth)/signin/page.js
"use client"; // Mark as a client component
import Arrow from "@/components/Arrow";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      // Redirect to home if not admin
      if (session.user.role !== "ADMIN") {
        router.push("/");
      } else {
        router.push("/dashboard");
      }
    }
  }, [status, session, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-6 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold">Sign in</h1>
          <p className="mt-2 text-sm">Use your Google account to access content.</p>
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-6 w-6">
            <path
              fill="#4285F4"
              d="M24 9.5c3.5 0 6.5 1.2 8.9 3.4l6.6-6.6C34.7 3.2 29.7 1 24 1 14.9 1 7.2 6.4 3.9 14.1l7.8 6.1C13.6 13 18.4 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M9.9 24c0-1.6.3-3.2.8-4.7L3 14.1C1.5 17.3 1 20.6 1 24s.5 6.7 2 9.9l7.7-6.1c-.5-1.4-.8-2.9-.8-4.8z"
            />
            <path
              fill="#FBBC05"
              d="M24 38.5c-4.8 0-9-2.6-11.2-6.5l-7.7 6.1C7.2 41.6 14.9 47 24 47c5.7 0 10.7-2.2 14.5-5.7l-7.4-5.8c-2 1.3-4.5 2-7.1 2z"
            />
            <path
              fill="#EA4335"
              d="M46 24c0-1.3-.1-2.5-.3-3.7H24v8.2h12.4c-1 3.5-3.5 6.5-7 8.4l7.4 5.8C42.4 38.4 46 31.7 46 24z"
            />
          </svg>
          <span className="text-sm font-medium">Sign in with Google</span>
        </button>

        <div>
          <Link href={'/'}>
            <Arrow text={"return home"}/>          
          </Link>
        </div>
      </div>
    </div>
  );
}
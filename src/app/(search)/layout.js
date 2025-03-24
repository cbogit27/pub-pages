"use client"// app/(main)/layout.js

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { NextAuthProvider } from "../providers";
import { Suspense } from "react";

export default function SearchLayout({ children }) {
  return (
    
      
      <Suspense>
        <NextAuthProvider>
      <Header />
      {children}
      <Footer />    
    </NextAuthProvider>
      </Suspense>
      

  );
}
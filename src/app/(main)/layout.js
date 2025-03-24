"use client"// app/(main)/layout.js

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { NextAuthProvider } from "../providers";

export default function MainLayout({ children }) {
  return (
    
      
      <NextAuthProvider>
      <Header />
      {children}
      <Footer />    
    </NextAuthProvider>
      

  );
}
"use client"// app/(main)/layout.js

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NextAuthProvider } from "@/app/providers";


export default function MainLayout({ children }) {
  return (
    
      
      <NextAuthProvider>
      <Header />
      {children}
      <Footer />    
    </NextAuthProvider>
      

  );
}
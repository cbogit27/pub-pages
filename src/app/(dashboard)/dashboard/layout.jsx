"use client"// app/(dashboard)/layout.js

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NextAuthProvider } from "@/app/providers";


export default function DashboardLayout({ children }) {
  return (
    
      
      <NextAuthProvider>
      <Header />
      {children}
      <Footer />    
    </NextAuthProvider>
      

  );
}
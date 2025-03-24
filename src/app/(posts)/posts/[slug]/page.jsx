import * as React from 'react'
import { redirect } from 'next/navigation';

export async function generateMetadata({ params },parent) {
    const { slug } = await params;
    
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/${slug}`);
        if (!response.ok) throw new Error("Failed to fetch metadata");

        const post = await response.json();
        
        return {
            title: post.title || "Default Title",
            description: post.description || "Post details",
            alternates: {
                canonical: `/posts/${slug}`,
              },
        
        };
    } catch (error) {
        return { title: "Post Not Found", description: "No post data available." };
    }
}

export default async function PostPage({ params }) {
    const { slug } = await params;

    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/${slug}`);
        if (!response.ok) throw new Error("Failed to fetch post");

        const post = await response.json();

        // Redirect if the fetched post's slug doesn't match the URL slug
        if (post.slug !== slug) {
            redirect(`/posts/${post.slug}`);
        }

        return (
            <>
                
                 
            </>
        );
    } catch (error) {}
}

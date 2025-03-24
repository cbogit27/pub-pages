"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddDashboardPostForm from "@/app/(dashboard)/components/post-add-form";

export default function EditPostPage() {
  const { slug } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`/api/posts/${slug}`);
      const data = await response.json();
      setInitialData(data);
    };
    fetchPost();
  }, [slug]);

  const handleSubmit = async (formData) => {
    const response = await fetch(`/api/posts/${slug}`, {
      method: 'PUT',
      body: formData
    });
    if (!response.ok) throw new Error(await response.text());
  };

  return initialData ? <AddDashboardPostForm initialData={initialData} onSubmit={handleSubmit} /> : <div>Loading...</div>;
}
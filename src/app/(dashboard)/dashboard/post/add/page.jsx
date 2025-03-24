"use client";
import AddDashboardPostForm from '@/app/(dashboard)/components/post-add-form';

export default function CreatePostPage() {
  const handleSubmit = async (formData) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error(await response.text());
  };

  return <AddDashboardPostForm onSubmit={handleSubmit} />;
}
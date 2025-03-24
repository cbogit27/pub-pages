"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AiTwotoneDelete } from "react-icons/ai";

export default function DeletePostButton({ slug, onDelete }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`/api/posts/${slug}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete post");
        }

        toast.success("Post deleted successfully");
        onDelete(); // Trigger posts refresh
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
      <AiTwotoneDelete size={20} />
    </button>
  );
}
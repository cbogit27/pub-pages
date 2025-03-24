"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import Select from "@/components/Select";
import ImageUploader from "./ImageUploader";

export default function AddDashboardPostForm({ initialData, onSubmit }) {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/signin");
    },
  });

  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || "",
    categoryId: initialData?.categoryId || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    image: initialData?.image || null,
    published: initialData?.published || false
  }));

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState(initialData?.image || null);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated" && session.user.role !== "ADMIN") {
      toast.error("Admin privileges required");
      router.push("/dashboard");
      return;
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchRequiredData = async () => {
      try {
        const categoriesRes = await fetch('/api/categories');

        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      } catch (error) {
        toast.error(error.message || "Failed to load data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchRequiredData();
  }, [status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      setErrors(prev => ({ ...prev, image: "Please upload an image file" }));
      return;
    }

    const preview = URL.createObjectURL(file);
    setFilePreview(preview);
    setFormData(prev => ({ ...prev, image: file }));
    setErrors(prev => ({ ...prev, image: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.image && !initialData?.image) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const toastId = toast.loading(initialData ? "Updating post..." : "Saving post...");

    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("categoryId", formData.categoryId);
      formPayload.append("description", formData.description || "");
      formPayload.append("content", formData.content);
      formPayload.append("published", formData.published.toString());
      
      if (formData.image instanceof File) {
        formPayload.append("image", formData.image);
      }

      const url = initialData 
        ? `/api/posts/${initialData.slug}`
        : '/api/posts';
      
      const method = initialData ? 'PUT' : 'POST';
      
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formPayload,
      });

      if (initialData && response.ok) {
        const data = await response.json();
        if (data.newSlug) {
          router.push(`/dashboard/posts/${data.newSlug}`);
          return;
        }
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create post");
      }
      
      toast.success("Post created successfully", { id: toastId });
      router.push("/dashboard");
      
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Failed to save post", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || loadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {initialData ? "Edit Post" : "Create New Post"}
      </h1>
      
      {categories.length === 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          No categories found. Please create categories first.
        </div>
      )}

      <form
        className="space-y-6 bg-gray-800 rounded-lg shadow-md p-4"
        onSubmit={handleFormSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title Field */}
          <div className="col-span-1 md:col-span-2">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter post title"
              error={errors.title}
              required
            />
          </div>

          {/* Category Field */}
          <div className="col-span-1">
            <Select
              label="Category"
              name="categoryId"
              value={formData.categoryId || ""}
              onChange={handleInputChange}
              options={categories}
              optionlabel="name"
              className="w-full"
              error={errors.categoryId}
              disabled={categories.length === 0}
            >
              <option value="">{categories.length ? 'Select a category' : 'No categories available'}</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Publish Toggle */}
          <div className="col-span-1">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  published: e.target.checked
                }))}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-gray-300">
                Publish Immediately
              </span>
            </label>
          </div>

          {/* Image Upload */}
          <div className="col-span-1 md:col-span-2">
            <ImageUploader
              label="Featured Image"
              onFileSelect={handleImageUpload}
              preview={filePreview}
              error={errors.image}
              required={!initialData?.image}
            />
          </div>

          {/* Description Field */}
          <div className="col-span-1 md:col-span-2">
            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter short description"
              error={errors.description}
              multiline="true"
            />
          </div>

          {/* Content Field */}
          <div className="col-span-1 md:col-span-2">
            <TextArea
              label="Content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Write your post content here..."
              rows={8}
              error={errors.content}
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-700">
          <button
            type="submit"
            disabled={isSubmitting || categories.length === 0}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : (
              initialData ? "Update Post" : "Create Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
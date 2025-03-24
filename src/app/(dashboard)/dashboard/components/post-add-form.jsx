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

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    categoryId: initialData?.categoryId || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    image: initialData?.image || null,
    published: initialData?.published || false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState(initialData?.image || null);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated" && session.user.role !== "ADMIN") {
      toast.error("Admin privileges required");
      router.push("/dashboard");
    }
  }, [status, session, router]);

  // Fetch required data
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchData = async () => {
      try {
        const [categoriesRes] = await Promise.all([
          fetch('/api/categories')
        ]);

        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      } catch (error) {
        toast.error(error.message || "Failed to load required data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const toastId = toast.loading(initialData ? "Updating post..." : "Creating post...");

    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("categoryId", formData.categoryId);
      formPayload.append("description", formData.description);
      formPayload.append("content", formData.content);
      formPayload.append("published", formData.published.toString());
      
      if (formData.image instanceof File) {
        formPayload.append("image", formData.image);
      }

      const url = initialData 
        ? `/api/posts/${initialData.slug}`
        : '/api/posts';
      
      const method = initialData ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formPayload,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle title conflict specifically
        if (response.status === 409 && data.error.includes("Title already exists")) {
          throw new Error("A post with this title already exists. Please choose a different title.");
        }
        throw new Error(data.error || "Failed to save post");
      }

      // Handle successful response
      toast.success(initialData ? "Post updated successfully" : "Post created successfully", { id: toastId });
      
      if (initialData && data.newSlug) {
        router.push(`/dashboard/${data.newSlug}`);
      } else {
        router.push("/dashboard/");
      }

      if (onSubmit) onSubmit(data);

    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.message, { id: toastId });
      
      // Highlight the title field if it's a conflict
      if (error.message.includes("title already exists")) {
        setErrors(prev => ({ ...prev, title: error.message }));
      }
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

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title Field */}
          <div className="col-span-2">
            <Input
              label="Post Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter a unique title for your post"
              error={errors.title}
              required
            />
          </div>

          {/* Category Selection */}
          <div className="col-span-1">
            <Select
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              options={categories}
              optionlabel="name"
              error={errors.categoryId}
              disabled={categories.length === 0}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Publish Toggle */}
          <div className="col-span-1 flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  published: e.target.checked
                }))}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Publish Immediately
              </span>
            </label>
          </div>

          {/* Image Upload */}
          <div className="col-span-2">
            <ImageUploader
              label="Featured Image"
              onFileSelect={handleImageUpload}
              preview={filePreview}
              error={errors.image}
              required={!initialData?.image}
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <Input
              label="Short Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="A brief summary of your post"
              error={errors.description}
              multiline="true"
              rows={3}
            />
          </div>

          {/* Content */}
          <div className="col-span-2">
            <TextArea
              label="Post Content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Write your post content here..."
              rows={10}
              error={errors.content}
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={isSubmitting || categories.length === 0}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting || categories.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useBlogCall from "../hooks/useBlogCall";
import useCategoryCall from "../hooks/useCategoryCall";
import { toastWarnNotify } from "../helper/ToastNotify";
import TinyMce from "../components/blog/TinyMce";
import { HiArrowLeft, HiSave } from "react-icons/hi";
import blogRatings from "../assets/blog-video.mp4";
import loadingGif from "../assets/loading.gif";

const CreateBlog = () => {
  const navigate = useNavigate();
  const { postBlog } = useBlogCall();
  const { getCategory } = useCategoryCall();
  const { categories, loading: categoriesLoading } = useSelector((state) => state.category);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    categoryId: "",
    content: "",
    isPublish: true,
  });

  const [errors, setErrors] = useState({
    title: "",
    image: "",
    categoryId: "",
    content: "",
  });

  useEffect(() => {
    getCategory("categories");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Title validation
    if (name === "title" && value.length > 100) {
      setErrors((prev) => ({ ...prev, title: "Title cannot exceed 100 characters" }));
    }
  };

  const handleContentChange = (updater) => {
    setFormData((prev) => {
      const updated = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      if (errors.content) {
        setErrors((prevErrors) => ({ ...prevErrors, content: "" }));
      }
      return updated;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (formData.title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
      isValid = false;
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required";
      isValid = false;
    } else {
      // Basic URL validation
      try {
        new URL(formData.image);
      } catch {
        newErrors.image = "Please enter a valid URL";
        isValid = false;
      }
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
      isValid = false;
    }

    const contentLength = formData.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (contentLength < 30) {
      newErrors.content = "Content must be at least 30 words";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toastWarnNotify("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    postBlog("blogs", formData);
    // Navigate to blogs page after successful creation
    // The toast notification from postBlog will indicate success
    setTimeout(() => {
      navigate("/blog");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video
          src={blogRatings}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20 dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/90 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
            >
              <HiArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Create New Blog Post
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Share your thoughts, ideas, and stories with the community
            </p>
          </div>

          {/* Form Card */}
          <div className="card p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter your blog title..."
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.title
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:border-primary-500"
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                  maxLength={100}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                    {formData.title.length}/100
                  </p>
                </div>
              </div>

              {/* Image URL Field */}
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.image
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:border-primary-500"
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                />
                {errors.image && (
                  <p className="text-sm text-red-500 mt-1">{errors.image}</p>
                )}
                {formData.image && !errors.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Category and Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Field */}
                <div>
                  <label
                    htmlFor="categoryId"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    disabled={categoriesLoading}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.categoryId
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary-500"
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="">
                      {categoriesLoading ? "Loading categories..." : "Select a category"}
                    </option>
                    {!categoriesLoading && categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))
                    ) : !categoriesLoading ? (
                      <option disabled>No categories available</option>
                    ) : null}
                  </select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>
                  )}
                </div>

                {/* Status Field */}
                <div>
                  <label
                    htmlFor="isPublish"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Status
                  </label>
                  <select
                    id="isPublish"
                    name="isPublish"
                    value={formData.isPublish.toString()}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isPublish: e.target.value === "true",
                      }))
                    }
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                  </select>
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <TinyMce
                    content={formData.content}
                    setInfo={handleContentChange}
                  />
                </div>
                {errors.content && (
                  <p className="text-sm text-red-500 mt-1">{errors.content}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Minimum 30 words required
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <img src={loadingGif} alt="Loading" className="w-5 h-5" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <HiSave className="w-5 h-5" />
                      <span>Create Blog</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;


import { useState, useEffect, useRef } from "react";
import useBlogCall from "../../hooks/useBlogCall";
import { toastWarnNotify } from "../../helper/ToastNotify";
import TinyMce from "./TinyMce";
import { useSelector } from "react-redux";
import useCategoryCall from "../../hooks/useCategoryCall";
import { 
  HiX, 
  HiCheckCircle, 
  HiExclamationCircle, 
  HiPencil,
  HiPhotograph,
  HiTag,
  HiStatusOnline,
  HiDocumentText
} from "react-icons/hi";

export default function EditBlogModal({
  open,
  onClose,
  blog,
  initialState,
  onSuccess,
}) {
  const { putBlog } = useBlogCall();
  const { getCategory } = useCategoryCall();
  const { categories: categoriesFromRedux, loading } = useSelector((state) => state.category);
  const [info, setInfo] = useState(initialState);
  const modalRef = useRef(null);

  useEffect(() => {
    if (open && (!categoriesFromRedux || categoriesFromRedux.length === 0) && !loading) {
      getCategory("categories");
    }
  }, [open, categoriesFromRedux, loading, getCategory]);

  // Update info when initialState changes
  useEffect(() => {
    if (open && initialState) {
      setInfo(initialState);
    }
  }, [open, initialState]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  // Focus trap
  useEffect(() => {
    if (open && modalRef.current) {
      const firstInput = modalRef.current.querySelector("input, select, textarea, button");
      firstInput?.focus();
    }
  }, [open]);

  const [titleError, setTitleError] = useState("");
  const [imageError, setImageError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const validateTitle = (value) => {
    if (!value.trim()) {
      setTitleError("Title is required");
      return false;
    }
    if (value.length > 100) {
      setTitleError("Title cannot exceed 100 characters");
      return false;
    }
    setTitleError("");
    return true;
  };

  const validateImage = (value) => {
    if (!value.trim()) {
      setImageError("Image URL is required");
      return false;
    }
    try {
      new URL(value);
      setImageError("");
      return true;
    } catch {
      setImageError("Please enter a valid URL");
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });

    if (name === "title") {
      validateTitle(value);
    } else if (name === "image") {
      validateImage(value);
    } else if (name === "categoryId") {
      setCategoryError("");
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      validateTitle(value);
    } else if (name === "image") {
      validateImage(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isTitleValid = validateTitle(info.title);
    const isImageValid = validateImage(info.image);
    const isCategoryValid = info.categoryId;

    if (!isCategoryValid) {
      setCategoryError("Please select a category");
    }

    if (!isTitleValid || !isImageValid || !isCategoryValid) {
      toastWarnNotify("Please fill in all required fields correctly");
      return;
    }

    const contentLength = info.content?.trim().split(/\s+/).length || 0;
    if (contentLength < 30) {
      toastWarnNotify("Content must be at least 30 words");
      return;
    }

    putBlog("blogs", blog._id, info);
    onClose();
    // Reset errors
    setTitleError("");
    setImageError("");
    setCategoryError("");
  };

  const isPublish = [
    { id: 1, name: "Published", value: true },
    { id: 2, name: "Draft", value: false },
  ];

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Animated Backdrop with gradient */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md transition-opacity duration-500"
        onClick={onClose}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
      </div>

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl transition-all duration-500 animate-scale-in border border-white/20 dark:border-gray-700/50"
          onClick={(e) => e.stopPropagation()}
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Animated gradient border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
          
          {/* Header with modern design */}
          <div className="relative flex items-center justify-between px-8 py-6 bg-gradient-to-r from-primary-600/10 via-accent-600/10 to-primary-600/10 dark:from-primary-900/30 dark:via-accent-900/30 dark:to-primary-900/30 border-b border-primary-200/50 dark:border-primary-800/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                  <HiPencil className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h2
                  id="modal-title"
                  className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-accent-400"
                >
                  Edit Blog
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Update your blog post
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group relative rounded-xl p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              aria-label="Close modal"
            >
              <HiX className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[calc(90vh-180px)] overflow-y-auto custom-scrollbar">
            {/* Title Field */}
            <div className="group">
              <label
                htmlFor="title"
                className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3"
              >
                <HiDocumentText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span>Blog Title</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={info.title || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 ${
                    titleError
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      : info.title && !titleError
                      ? "border-green-500/50 focus:border-primary-500"
                      : "border-gray-300/50 dark:border-gray-600/50 focus:border-primary-500"
                  }`}
                  placeholder="Write an engaging title..."
                  aria-invalid={!!titleError}
                  aria-describedby={titleError ? "title-error" : undefined}
                />
                {!titleError && info.title && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <HiCheckCircle className="w-6 h-6 text-green-500 animate-scale-in" />
                  </div>
                )}
                {titleError && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <HiExclamationCircle className="w-6 h-6 text-red-500" />
                  </div>
                )}
              </div>
              {titleError && (
                <p
                  id="title-error"
                  className="mt-2 flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 animate-slide-down"
                  role="alert"
                >
                  <HiExclamationCircle className="w-4 h-4 shrink-0" />
                  <span>{titleError}</span>
                </p>
              )}
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {info.title?.length || 0}/100 characters
                </p>
                {info.title && !titleError && (
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                    ✓ Looks good!
                  </p>
                )}
              </div>
            </div>

            {/* Image URL Field */}
            <div className="group">
              <label
                htmlFor="image"
                className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3"
              >
                <HiPhotograph className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span>Featured Image URL</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="image"
                  name="image"
                  type="url"
                  value={info.image || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 ${
                    imageError
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      : info.image && !imageError
                      ? "border-green-500/50 focus:border-primary-500"
                      : "border-gray-300/50 dark:border-gray-600/50 focus:border-primary-500"
                  }`}
                  placeholder="https://example.com/beautiful-image.jpg"
                  aria-invalid={!!imageError}
                  aria-describedby={imageError ? "image-error" : undefined}
                />
                {!imageError && info.image && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <HiCheckCircle className="w-6 h-6 text-green-500 animate-scale-in" />
                  </div>
                )}
                {imageError && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <HiExclamationCircle className="w-6 h-6 text-red-500" />
                  </div>
                )}
              </div>
              {imageError && (
                <p
                  id="image-error"
                  className="mt-2 flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 animate-slide-down"
                  role="alert"
                >
                  <HiExclamationCircle className="w-4 h-4 shrink-0" />
                  <span>{imageError}</span>
                </p>
              )}
              {info.image && !imageError && (
                <div className="mt-4 relative group/image-preview rounded-2xl overflow-hidden border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image-preview:opacity-100 transition-opacity duration-300 z-10"></div>
                  <img
                    src={info.image}
                    alt="Preview"
                    className="w-full h-64 object-cover group-hover/image-preview:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover/image-preview:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">Image Preview</p>
                  </div>
                </div>
              )}
            </div>

            {/* Category Field */}
            <div className="group">
              <label
                htmlFor="categoryId"
                className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3"
              >
                <HiTag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span>Category</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="categoryId"
                  name="categoryId"
                  value={info?.categoryId || ""}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-500/20 appearance-none cursor-pointer ${
                    categoryError
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      : info?.categoryId
                      ? "border-green-500/50 focus:border-primary-500"
                      : "border-gray-300/50 dark:border-gray-600/50 focus:border-primary-500"
                  }`}
                  aria-invalid={!!categoryError}
                  aria-describedby={categoryError ? "category-error" : undefined}
                >
                  <option value="">Choose a category...</option>
                  {loading || !categoriesFromRedux || categoriesFromRedux.length === 0 ? (
                    <option disabled>Loading categories...</option>
                  ) : (
                    categoriesFromRedux.map((category) => (
                      <option key={category?._id} value={category?._id}>
                        {category?.name}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {categoryError && (
                <p
                  id="category-error"
                  className="mt-2 flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 animate-slide-down"
                  role="alert"
                >
                  <HiExclamationCircle className="w-4 h-4 shrink-0" />
                  <span>{categoryError}</span>
                </p>
              )}
            </div>

            {/* Status Field */}
            <div className="group">
              <label
                htmlFor="isPublish"
                className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3"
              >
                <HiStatusOnline className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span>Publish Status</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="isPublish"
                  name="isPublish"
                  value={info.isPublish ?? true}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-300/50 dark:border-gray-600/50 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 appearance-none cursor-pointer"
                >
                  {isPublish.map((status) => (
                    <option key={status.id} value={status.value}>
                      {status.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                <HiDocumentText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span>Blog Content</span>
                <span className="text-red-500">*</span>
                <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                  (Minimum 30 words)
                </span>
              </label>
              <div className="relative rounded-2xl overflow-hidden border-2 border-gray-300/50 dark:border-gray-600/50 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/20 transition-all duration-300">
                <TinyMce content={initialState.content} setInfo={setInfo} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
              <button
                type="button"
                onClick={onClose}
                className="group relative px-8 py-4 rounded-2xl font-bold text-gray-700 dark:text-gray-300 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/20 hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">Cancel</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                type="submit"
                className="group relative px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 hover:from-primary-700 hover:via-primary-600 hover:to-accent-700 shadow-xl shadow-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/60 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Update Blog</span>
                  <HiPencil className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

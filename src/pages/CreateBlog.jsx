import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useBlogCall from "../hooks/useBlogCall";
import useCategoryCall from "../hooks/useCategoryCall";
import { toastWarnNotify, toastSuccessNotify } from "../helper/ToastNotify";
import TinyMce from "../components/blog/TinyMce";
import ImageUploader from "../components/global/ImageUploader";
import { 
  HiArrowLeft, 
  HiSave, 
  HiEye, 
  HiEyeOff, 
  HiCheckCircle, 
  HiExclamationCircle,
  HiClock,
  HiDocumentText,
  HiPhotograph,
  HiTag,
  HiStatusOnline
} from "react-icons/hi";
import blogRatings from "../assets/blog-video.mp4";
import loadingGif from "../assets/loading.gif";

const DRAFT_STORAGE_KEY = "bloggy_draft_blog";

const CreateBlog = () => {
  const navigate = useNavigate();
  const { postBlog } = useBlogCall();
  const { getCategory } = useCategoryCall();
  const { categories, loading: categoriesLoading } = useSelector((state) => state.category);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [formData, setFormData] = useState(() => {
    // Load draft from localStorage on mount
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        return {
          title: parsed.title || "",
          image: parsed.image || "",
          categoryId: parsed.categoryId || "",
          content: parsed.content || "",
          isPublish: parsed.isPublish ?? true,
        };
      } catch {
        return {
          title: "",
          image: "",
          categoryId: "",
          content: "",
          isPublish: true,
        };
      }
    }
    return {
      title: "",
      image: "",
      categoryId: "",
      content: "",
      isPublish: true,
    };
  });

  const [errors, setErrors] = useState({
    title: "",
    image: "",
    categoryId: "",
    content: "",
  });

  // Auto-save draft to localStorage
  const saveDraft = useCallback(() => {
    if (formData.title || formData.content || formData.image) {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    }
  }, [formData]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [formData, hasUnsavedChanges, saveDraft]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S or Cmd+S to save draft
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveDraft();
        toastSuccessNotify("Draft saved locally!");
      }
      // Escape to close preview
      if (e.key === "Escape" && showPreview) {
        setShowPreview(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPreview, saveDraft]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    getCategory("categories");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate word count
  const getWordCount = (text) => {
    if (!text) return 0;
    const stripped = text.replace(/<[^>]*>/g, ""); // Remove HTML tags
    const words = stripped.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  };

  const wordCount = getWordCount(formData.content);
  const minWords = 30;
  const isContentValid = wordCount >= minWords;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
    
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
      setHasUnsavedChanges(true);
      if (errors.content) {
        setErrors((prevErrors) => ({ ...prevErrors, content: "" }));
      }
      return updated;
    });
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setFormData({
      title: "",
      image: "",
      categoryId: "",
      content: "",
      isPublish: true,
    });
    setHasUnsavedChanges(false);
    setLastSaved(null);
    toastSuccessNotify("Draft cleared!");
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

    if (wordCount < minWords) {
      newErrors.content = `Content must be at least ${minWords} words (currently ${wordCount})`;
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
    // Clear draft after successful submission
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasUnsavedChanges(false);
    // Navigate to blogs page after successful creation
    setTimeout(() => {
      navigate("/blog");
      setIsSubmitting(false);
    }, 1500);
  };

  const selectedCategory = categories.find(cat => cat._id === formData.categoryId);

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
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <HiArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              
              {/* Draft Status & Actions */}
              <div className="flex items-center space-x-3">
                {lastSaved && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <HiClock className="w-4 h-4" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
                {hasUnsavedChanges && (
                  <div className="flex items-center space-x-2 text-xs text-orange-500">
                    <HiExclamationCircle className="w-4 h-4" />
                    <span>Unsaved changes</span>
                  </div>
                )}
                <button
                  onClick={saveDraft}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  title="Save draft (Ctrl+S)"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all flex items-center space-x-1"
                >
                  {showPreview ? (
                    <>
                      <HiEyeOff className="w-4 h-4" />
                      <span>Hide Preview</span>
                    </>
                  ) : (
                    <>
                      <HiEye className="w-4 h-4" />
                      <span>Preview</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Create New Blog Post
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Share your thoughts, ideas, and stories with the community
            </p>
          </div>

          {/* Preview Mode */}
          {showPreview ? (
            <div className="card p-6 md:p-8 mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {formData.title || "Untitled Blog Post"}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  {selectedCategory && (
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-medium">
                      {selectedCategory.name}
                    </span>
                  )}
                  <span className={formData.isPublish ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}>
                    {formData.isPublish ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
              {formData.image && (
                <div className="mb-6">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.content || "<p className='text-gray-500 dark:text-gray-400 italic'>No content yet...</p>" }}
              />
            </div>
          ) : null}

          {/* Form Card */}
          <div className="card p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div>
                <label
                  htmlFor="title"
                  className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <HiDocumentText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span>Title</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
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
                        : formData.title && !errors.title
                        ? "border-green-500 focus:border-primary-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-primary-500"
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                    maxLength={100}
                  />
                  {formData.title && !errors.title && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <HiCheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                  {errors.title && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <HiExclamationCircle className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-1">
                  {errors.title && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <HiExclamationCircle className="w-4 h-4" />
                      <span>{errors.title}</span>
                    </p>
                  )}
                  <p className={`text-xs ml-auto ${formData.title.length > 90 ? "text-orange-500" : "text-gray-500 dark:text-gray-400"}`}>
                    {formData.title.length}/100
                  </p>
                </div>
              </div>

              {/* Image Upload Field */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <HiPhotograph className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Featured Image
                  </span>
                  <span className="text-red-500">*</span>
                </div>
                <ImageUploader
                  onImageUploaded={(url) => {
                    setFormData((prev) => ({ ...prev, image: url }));
                    setHasUnsavedChanges(true);
                    if (errors.image) {
                      setErrors((prev) => ({ ...prev, image: "" }));
                    }
                  }}
                  currentImageUrl={formData.image}
                  label=""
                  maxSizeMB={10}
                />
                {errors.image && (
                  <p className="text-sm text-red-500 mt-1 flex items-center space-x-1">
                    <HiExclamationCircle className="w-4 h-4" />
                    <span>{errors.image}</span>
                  </p>
                )}
              </div>

              {/* Category and Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Field */}
                <div>
                  <label
                    htmlFor="categoryId"
                    className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <HiTag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span>Category</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      disabled={categoriesLoading}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer ${
                        errors.categoryId
                          ? "border-red-500 focus:ring-red-500"
                          : formData.categoryId && !errors.categoryId
                          ? "border-green-500 focus:border-primary-500"
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
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {formData.categoryId && !errors.categoryId && (
                      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                        <HiCheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {errors.categoryId && (
                    <p className="text-sm text-red-500 mt-1 flex items-center space-x-1">
                      <HiExclamationCircle className="w-4 h-4" />
                      <span>{errors.categoryId}</span>
                    </p>
                  )}
                </div>

                {/* Status Field */}
                <div>
                  <label
                    htmlFor="isPublish"
                    className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <HiStatusOnline className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span>Publish Status</span>
                  </label>
                  <div className="relative">
                    <select
                      id="isPublish"
                      name="isPublish"
                      value={formData.isPublish.toString()}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          isPublish: e.target.value === "true",
                        }));
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
                    >
                      <option value="true">Published</option>
                      <option value="false">Draft</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <HiDocumentText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span>Content</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      isContentValid 
                        ? "text-green-600 dark:text-green-400" 
                        : wordCount > 0 
                        ? "text-orange-600 dark:text-orange-400" 
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {wordCount} / {minWords} words
                    </span>
                    {isContentValid && (
                      <HiCheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
                <div className={`border-2 rounded-lg overflow-hidden transition-all ${
                  errors.content
                    ? "border-red-500"
                    : isContentValid
                    ? "border-green-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}>
                  <TinyMce
                    content={formData.content}
                    setInfo={handleContentChange}
                  />
                </div>
                {errors.content && (
                  <p className="text-sm text-red-500 mt-1 flex items-center space-x-1">
                    <HiExclamationCircle className="w-4 h-4" />
                    <span>{errors.content}</span>
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Minimum {minWords} words required
                  </p>
                  {isContentValid && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      ✓ Content length is valid
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:via-primary-600 hover:to-accent-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <img src={loadingGif} alt="Loading" className="w-5 h-5" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <HiSave className="w-5 h-5" />
                      <span>Publish Blog</span>
                    </>
                  )}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={clearDraft}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm"
                    title="Clear draft"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (hasUnsavedChanges) {
                        if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
                          navigate(-1);
                        }
                      } else {
                        navigate(-1);
                      }
                    }}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">Keyboard Shortcuts:</p>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span><kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">Ctrl</kbd> + <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">S</kbd> - Save draft</span>
              <span><kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">Esc</kbd> - Close preview</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;


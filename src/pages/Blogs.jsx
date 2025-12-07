import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import useBlogCall from "../hooks/useBlogCall";
import useCategoryCall from "../hooks/useCategoryCall";
import BlogCard from "../components/blog/BlogCard";
import Footer from "../components/home/Footer";
import PageHero from "../components/home/PageHero";
import SkeletonLoader from "../components/global/SkeletonLoader";
import Pagination from "../components/global/Pagination";
import usePagination from "../hooks/usePagination";
import { HiSearch, HiBookOpen, HiTag, HiX, HiChevronDown, HiChevronUp } from "react-icons/hi";

const Blogs = () => {
  const { getBlogData } = useBlogCall();
  const { blogs, loading } = useSelector((state) => state.blog);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.category);
  const { getCategory } = useCategoryCall();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const isLoading = loading || categoriesLoading;

  const categoriesWithCount = useMemo(() => {
    if (!Array.isArray(categories) || !Array.isArray(blogs)) {
      return [];
    }
    return categories
      .map((category) => {
        const count = blogs.filter(
          (blog) => blog.categoryId?._id === category._id
        ).length;
        return { ...category, count };
      })
      .filter((category) => category.count > 0);
  }, [categories, blogs]);

  const filteredBlogs = useMemo(() => {
    if (!Array.isArray(blogs)) {
      return [];
    }
    return blogs.filter((blog) => {
      const matchesSearch = 
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        !selectedCategory || 
        blog.categoryId?._id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchTerm, selectedCategory]);

  const {
    currentPage,
    itemsPerPage,
    paginatedData: currentBlogs,
    totalPages,
    totalItems,
    handlePageChange,
  } = usePagination(filteredBlogs, 12, [searchTerm, selectedCategory]);

  useEffect(() => {
    getBlogData("blogs");
    getCategory("categories");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <PageHero
        title="All Blogs"
        description="Discover stories, insights, and ideas from our community"
        showHomeButton={true}
        padding="py-24 md:py-32"
        icon={HiBookOpen}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar - Left */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="lg:hidden w-full flex items-center justify-between px-4 py-3 mb-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              aria-label="Toggle categories"
              aria-expanded={isCategoriesOpen}
            >
              <div className="flex items-center space-x-2">
                <HiTag className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-semibold">Categories</span>
              </div>
              {isCategoriesOpen ? (
                <HiChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <HiChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            <div className={`lg:sticky lg:top-24 transition-all duration-300 ease-in-out ${
              isCategoriesOpen 
                ? 'max-h-[1000px] opacity-100 block' 
                : 'max-h-0 opacity-0 overflow-hidden hidden lg:block lg:max-h-none lg:opacity-100'
            }`}>
              <div className="mb-4 hidden lg:block">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
                  <HiTag className="w-4 h-4 text-primary-500" />
                  <span>Categories</span>
                </h3>
              </div>
              
              <div className="space-y-1">
                {/* All Categories */}
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    // Close categories on mobile after selection
                    if (window.innerWidth < 1024) {
                      setIsCategoriesOpen(false);
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    !selectedCategory
                      ? "bg-primary-500 text-white font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  aria-label="Show all categories"
                >
                  <div className="flex items-center justify-between">
                    <span>All</span>
                    <span className={`text-xs ${!selectedCategory ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                      {Array.isArray(blogs) ? blogs.length : 0}
                    </span>
                  </div>
                </button>

                {/* Category List */}
                {categoriesWithCount.map((category) => {
                  const isSelected = selectedCategory === category._id;
                  return (
                    <button
                      key={category._id}
                      onClick={() => {
                        setSelectedCategory(category._id);
                        // Close categories on mobile after selection
                        if (window.innerWidth < 1024) {
                          setIsCategoriesOpen(false);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        isSelected
                          ? "bg-primary-500 text-white font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      aria-label={`Filter by ${category.name} category`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{category.name}</span>
                        <span className={`text-xs flex-shrink-0 ml-2 ${isSelected ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                          {category.count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Content - Right */}
          <div className="flex-1 min-w-0">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Clear search"
                  >
                    <HiX className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Results Count */}
            {!isLoading && (
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredBlogs.length}</span> blog{filteredBlogs.length !== 1 ? "s" : ""} found
                  {searchTerm && (
                    <span className="ml-2">
                      for "<span className="font-semibold text-primary-600 dark:text-primary-400">{searchTerm}</span>"
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="ml-2">
                      in <span className="font-semibold text-primary-600 dark:text-primary-400">
                        {Array.isArray(categories) ? categories.find(c => c._id === selectedCategory)?.name || "category" : "category"}
                      </span>
                    </span>
                  )}
                </p>
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("");
                    }}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm font-medium"
                    aria-label="Clear all filters"
                  >
                    <HiX className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            )}

            {isLoading ? (
              <SkeletonLoader type="list" count={12} />
            ) : (
              <>
                {currentBlogs.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      {currentBlogs.map((blog) => (
                        <BlogCard key={blog._id} {...blog} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mb-8">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                          itemsPerPage={itemsPerPage}
                          totalItems={totalItems}
                          showItemsPerPage={false}
                          showInfo={false}
                          itemName="blogs"
                          variant="default"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20 px-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 mb-6 animate-pulse">
                      <HiSearch className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      No blogs found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      {searchTerm || selectedCategory
                        ? "Try adjusting your search or filter criteria to find what you're looking for."
                        : "Be the first to write a blog and share your thoughts with the community!"}
                    </p>
                    {(searchTerm || selectedCategory) && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("");
                        }}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold hover:from-primary-700 hover:to-accent-700 transition-all duration-200 shadow-lg shadow-primary-500/50 hover:shadow-xl hover:shadow-primary-500/60 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        aria-label="Clear all filters"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Blogs;
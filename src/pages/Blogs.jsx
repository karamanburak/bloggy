import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useBlogCall from "../hooks/useBlogCall";
import useCategoryCall from "../hooks/useCategoryCall";
import BlogCard from "../components/blog/BlogCard";
import Footer from "../components/home/Footer";
import PageHero from "../components/home/PageHero";
import SkeletonLoader from "../components/global/SkeletonLoader";
import { HiChevronLeft, HiChevronRight, HiSearch, HiFilter, HiBookOpen } from "react-icons/hi";

const Blogs = () => {
  const navigate = useNavigate();
  const { getBlogData } = useBlogCall();
  const { blogs, loading } = useSelector((state) => state.blog);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.category);
  const { getCategory } = useCategoryCall();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const blogsPerPage = 12;

  // Tüm veriler gelene kadar loading state'i
  const isLoading = loading || categoriesLoading;

  // Filter blogs based on search and category
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = 
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      !selectedCategory || 
      blog.categoryId?._id === selectedCategory ||
      blog.categoryId?._id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    getBlogData("blogs");
    getCategory("categories");
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

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
        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4 md:flex md:items-center md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <HiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-12 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer min-w-[200px]"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredBlogs.length}</span> blog{filteredBlogs.length !== 1 ? "s" : ""}
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory && ` in ${categories.find(c => c._id === selectedCategory)?.name || "category"}`}
            </p>
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
                  <div className="flex items-center justify-center space-x-2 mb-8">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                      aria-label="Previous page"
                    >
                      <HiChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="flex items-center space-x-2">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => paginate(page)}
                              className={`w-10 h-10 rounded-lg font-semibold transition-all hover:scale-105 ${
                                currentPage === page
                                  ? "bg-primary-600 text-white shadow-lg"
                                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="text-gray-500 dark:text-gray-400 px-2">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                      aria-label="Next page"
                    >
                      <HiChevronRight className="w-6 h-6" />
                    </button>
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Blogs;
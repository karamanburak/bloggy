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
import { HiSearch, HiBookOpen, HiTag, HiX, HiChevronDown, HiChevronUp, HiSortAscending, HiSortDescending } from "react-icons/hi";

const Blogs = () => {
  const { getBlogData } = useBlogCall();
  const { blogs, loading } = useSelector((state) => state.blog);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.category);
  const { getCategory } = useCategoryCall();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular"); // popular, likes, comments, views, newest, oldest
  const [isSortOpen, setIsSortOpen] = useState(false);
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
      .filter((category) => category.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [categories, blogs]);

  const getParentCommentCount = (comments) => {
    if (!Array.isArray(comments)) return 0;
    return comments.filter(comment => {
      const parentId = comment.parentCommentId || comment.parentId || comment.parentComment || comment.replyTo || comment.parent;
      if (typeof parentId === 'string' && parentId.trim() !== '' && parentId !== 'null' && parentId !== 'undefined') {
        return false; 
      }
      if (typeof parentId === 'object' && parentId !== null) {
        return false;
      }
      return true;
    }).length;
  };

  const calculatePopularityScore = (blog) => {
    const likes = Array.isArray(blog.likes) ? blog.likes.length : 0;
    const comments = getParentCommentCount(blog.comments);
    const views = blog.countOfVisitors || 0;
    
    return (likes * 3) + (comments * 2) + views;
  };

  const filteredBlogs = useMemo(() => {
    if (!Array.isArray(blogs)) {
      return [];
    }
    
    let filtered = blogs.filter((blog) => {
      const matchesSearch = 
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        !selectedCategory || 
        blog.categoryId?._id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "popular": {
          const scoreA = calculatePopularityScore(a);
          const scoreB = calculatePopularityScore(b);
          return scoreB - scoreA;
        }
        case "likes": {
          const likesA = Array.isArray(a.likes) ? a.likes.length : 0;
          const likesB = Array.isArray(b.likes) ? b.likes.length : 0;
          return likesB - likesA;
        }
        case "comments": {
          const commentsA = getParentCommentCount(a.comments);
          const commentsB = getParentCommentCount(b.comments);
          return commentsB - commentsA;
        }
        case "views": {
          const viewsA = a.countOfVisitors || 0;
          const viewsB = b.countOfVisitors || 0;
          return viewsB - viewsA;
        }
        case "newest": {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        }
        case "oldest": {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA - dateB;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [blogs, searchTerm, selectedCategory, sortBy]);

  const {
    currentPage,
    itemsPerPage,
    paginatedData: currentBlogs,
    totalPages,
    totalItems,
    handlePageChange,
  } = usePagination(filteredBlogs, 12, [searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    getBlogData("blogs");
    getCategory("categories");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-white transition-colors duration-300">
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
              className="lg:hidden w-full flex items-center justify-between px-4 py-3 mb-4 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all"
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
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
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
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label="Show all categories"
                >
                  <div className="flex items-center justify-between">
                    <span>All</span>
                    <span className={`text-xs ${!selectedCategory ? "text-white/80" : "text-gray-500"}`}>
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
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      aria-label={`Filter by ${category.name} category`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{category.name}</span>
                        <span className={`text-xs flex-shrink-0 ml-2 ${isSelected ? "text-white/80" : "text-gray-500"}`}>
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
            {/* Search Bar and Sort */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Clear search"
                  >
                    <HiX className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all min-w-[180px]"
                  aria-label="Sort blogs"
                  aria-expanded={isSortOpen}
                >
                  <div className="flex items-center space-x-2">
                    {sortBy === "newest" || sortBy === "oldest" ? (
                      sortBy === "newest" ? (
                        <HiSortDescending className="w-4 h-4 text-primary-500" />
                      ) : (
                        <HiSortAscending className="w-4 h-4 text-primary-500" />
                      )
                    ) : (
                      <HiSortDescending className="w-4 h-4 text-primary-500" />
                    )}
                    <span className="text-sm font-medium">
                      {sortBy === "popular" && "Most Popular"}
                      {sortBy === "likes" && "Most Liked"}
                      {sortBy === "comments" && "Most Commented"}
                      {sortBy === "views" && "Most Viewed"}
                      {sortBy === "newest" && "Newest First"}
                      {sortBy === "oldest" && "Oldest First"}
                    </span>
                  </div>
                  {isSortOpen ? (
                    <HiChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <HiChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                
                {isSortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsSortOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-full sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                      <div className="py-1">
                        {[
                          { value: "popular", label: "Most Popular", desc: "Likes, comments & views" },
                          { value: "likes", label: "Most Liked", desc: "Highest likes first" },
                          { value: "comments", label: "Most Commented", desc: "Highest comments first" },
                          { value: "views", label: "Most Viewed", desc: "Highest views first" },
                          { value: "newest", label: "Newest First", desc: "Recently published" },
                          { value: "oldest", label: "Oldest First", desc: "Oldest published" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                              sortBy === option.value
                                ? "bg-primary-50 text-primary-700 font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="text-sm">{option.label}</span>
                              <span className={`text-xs mt-0.5 ${
                                sortBy === option.value
                                  ? "text-primary-600"
                                  : "text-gray-500"
                              }`}>
                                {option.desc}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Results Count */}
            {!isLoading && (
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredBlogs.length}</span> blog{filteredBlogs.length !== 1 ? "s" : ""} found
                  {searchTerm && (
                    <span className="ml-2">
                      for "<span className="font-semibold text-primary-600">{searchTerm}</span>"
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="ml-2">
                      in <span className="font-semibold text-primary-600">
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
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all text-sm font-medium"
                    aria-label="Clear all filters"
                  >
                    <HiX className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            )}

            {isLoading ? (
              <SkeletonLoader type="list" count={12} variant="threeColumnsGap6" />
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
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6 animate-pulse">
                      <HiSearch className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      No blogs found
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
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
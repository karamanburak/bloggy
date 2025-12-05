import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useBlogCall from "../hooks/useBlogCall";
import useCategoryCall from "../hooks/useCategoryCall";
import useNewsCall from "../hooks/useNewsCall";
import BlogCard from "../components/blog/BlogCard";
import Footer from "../components/home/Footer";
import NewsCard from "../components/home/NewsCard";
import SkeletonLoader from "../components/global/SkeletonLoader";
import { HiArrowRight, HiFire, HiNewspaper, HiSparkles, HiViewGrid, HiCollection } from "react-icons/hi";

const Dashboard = () => {
  const navigate = useNavigate();
  const { getBlogData } = useBlogCall();
  const { getCategory } = useCategoryCall();
  const { getNewsData } = useNewsCall();
  const { blogs, loading } = useSelector((state) => state.blog);
  const { news, loading: newsLoading } = useSelector((state) => state.newsShows);
  const { loading: categoriesLoading } = useSelector((state) => state.category);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [showAllNews, setShowAllNews] = useState(false);
  const [viewMode, setViewMode] = useState("slider"); // "slider" or "grid"

  // Tüm veriler gelene kadar loading state'i
  const isLoading = loading || newsLoading || categoriesLoading;

  const topTrendingBlogs = [...blogs]
    .sort((a, b) => (b.countOfVisitors || 0) - (a.countOfVisitors || 0))
    .slice(0, 6);

  useEffect(() => {
    getBlogData("blogs");
    getCategory("categories");
    getNewsData();
  }, []);

  // News carousel auto-rotate (only for slider mode)
  useEffect(() => {
    if (viewMode === "slider" && news.length > 1) {
      const interval = setInterval(() => {
        setCurrentNewsIndex((prev) => (prev + 1) % news.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [news.length, viewMode]);

  const handleNewsDotClick = (index) => {
    setCurrentNewsIndex(index);
  };

  const handleNextNews = () => {
    setCurrentNewsIndex((prev) => (prev + 1) % news.length);
  };

  const handlePrevNews = () => {
    setCurrentNewsIndex((prev) => (prev - 1 + news.length) % news.length);
  };


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Modern Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white py-24 md:py-32 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6 animate-scale-in">
            <HiSparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            Welcome to Bloggy
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto animate-slide-up">
            Discover stories, insights, and ideas from our vibrant community of writers and readers
          </p>
          <div className="flex items-center justify-center animate-slide-up">
            <button
              onClick={() => navigate("/blog")}
              className="group inline-flex items-center space-x-3 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl hover:shadow-3xl"
            >
              <span>Explore Blogs</span>
              <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <>
            {/* Trending Blogs Skeleton */}
            <section className="mb-20 animate-fade-in">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                    <HiFire className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                      Trending Now
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Discover the most popular stories this week
                    </p>
                  </div>
                </div>
              </div>
              <SkeletonLoader type="blogList" count={6} />
            </section>

            {/* Latest News Skeleton */}
            <section className="mb-20 animate-fade-in">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-primary-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-primary-600 to-accent-600 flex items-center justify-center shadow-xl">
                      <HiNewspaper className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                      Latest News
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
                      Stay updated with the latest happenings from multiple sources
                    </p>
                  </div>
                </div>
              </div>
              {viewMode === "slider" ? (
                <div className="flex justify-center items-center py-20">
                  <SkeletonLoader type="newsCard" count={1} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <SkeletonLoader key={index} type="newsCard" count={1} />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <>
            {/* Trending Blogs Section */}
            {topTrendingBlogs.length > 0 && (
              <section className="mb-20 animate-fade-in">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                      <HiFire className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                        Trending Now
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Discover the most popular stories this week
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/blog")}
                    className="hidden md:flex items-center space-x-2 px-6 py-3 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-semibold transition-all hover:scale-105"
                  >
                    <span>View All</span>
                    <HiArrowRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {topTrendingBlogs.map((blog) => (
                    <BlogCard key={blog._id} {...blog} />
                  ))}
                </div>
              </section>
            )}

            {/* Latest News Section */}
            <section className="mb-20 animate-fade-in">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-primary-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-primary-600 to-accent-600 flex items-center justify-center shadow-xl">
                      <HiNewspaper className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                      Latest News
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
                      Stay updated with the latest happenings from multiple sources
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setViewMode("slider")}
                      className={`p-2.5 rounded-lg transition-all duration-200 ${
                        viewMode === "slider"
                          ? "bg-primary-600 text-white shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      aria-label="Slider view"
                      title="Slider View"
                    >
                      <HiCollection className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2.5 rounded-lg transition-all duration-200 ${
                        viewMode === "grid"
                          ? "bg-primary-600 text-white shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      aria-label="Grid view"
                      title="Grid View"
                    >
                      <HiViewGrid className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {news.length > 0 ? (
            <div id="news-section" className="relative">
              {/* Background Decoration */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-primary-500/10 to-accent-500/10 rounded-3xl blur-2xl -z-10"></div>
              
              {/* Slider View */}
              {viewMode === "slider" ? (
                <div className="relative group">
                  <div 
                    key={currentNewsIndex}
                    className="animate-fade-in"
                    style={{
                      animation: 'fadeIn 0.5s ease-in-out'
                    }}
                  >
                    <div className="h-full">
                      <NewsCard {...news[currentNewsIndex]} />
                    </div>
                  </div>
                  
                  {/* Navigation Controls */}
                  {news.length > 1 && (
                    <>
                      {/* Previous/Next Buttons */}
                      <button
                        onClick={handlePrevNews}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        aria-label="Previous news"
                      >
                        <HiArrowRight className="w-5 h-5 rotate-180" />
                      </button>
                      <button
                        onClick={handleNextNews}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        aria-label="Next news"
                      >
                        <HiArrowRight className="w-5 h-5" />
                      </button>

                      {/* Pagination Dots */}
                      <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                        <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
                          {news.slice(0, Math.min(news.length, 15)).map((_, index) => (
                            <button
                              key={index}
                              onClick={() => handleNewsDotClick(index)}
                              className={`relative rounded-full transition-all duration-300 ${
                                index === currentNewsIndex
                                  ? "w-10 h-2.5 bg-gradient-to-r from-primary-600 to-accent-600 shadow-lg scale-110"
                                  : "w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 hover:scale-125"
                              }`}
                              aria-label={`Go to news ${index + 1}`}
                            >
                              {index === currentNewsIndex && (
                                <div className="absolute inset-0 bg-primary-400 rounded-full animate-pulse opacity-50"></div>
                              )}
                            </button>
                          ))}
                          {news.length > 15 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              +{news.length - 15} more
                            </span>
                          )}
                        </div>

                        {/* News Counter */}
                        <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                          <span className="px-4 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {currentNewsIndex + 1} / {news.length}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Grid View */
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(showAllNews ? news : news.slice(0, 9)).map((article, index) => (
                      <div
                        key={`${article.title}-${index}`}
                        className="animate-fade-in h-full"
                        style={{
                          animationDelay: `${index * 0.1}s`
                        }}
                      >
                        <NewsCard {...article} />
                      </div>
                    ))}
                  </div>

                  {/* Show More/Less Button */}
                  {news.length > 9 && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={() => setShowAllNews(!showAllNews)}
                        className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold hover:from-primary-700 hover:to-accent-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <span>
                          {showAllNews 
                            ? "Show Less" 
                            : `Load More News (${news.length - 9} more)`
                          }
                        </span>
                        <HiArrowRight className={`w-5 h-5 transition-transform ${showAllNews ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-3xl blur-xl -z-10"></div>
              <div className="card p-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent dark:from-gray-800/50 opacity-50"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                    <HiNewspaper className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No News Available
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Check back later for the latest updates!
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
          </>
        )}
      </div>

      {/* Footer */}
      <Footer isDashboard="/" />
    </div>
  );
};

export default Dashboard;
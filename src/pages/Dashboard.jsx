import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useBlogCall from "../hooks/useBlogCall";
import useCategoryCall from "../hooks/useCategoryCall";
import useNewsCall from "../hooks/useNewsCall";
import BlogCard from "../components/blog/BlogCard";
import Footer from "../components/home/Footer";
import NewsCard from "../components/home/NewsCard";
import PageHero from "../components/home/PageHero";
import SkeletonLoader from "../components/global/SkeletonLoader";
import { HiArrowRight, HiFire, HiNewspaper, HiViewGrid, HiCollection } from "react-icons/hi";

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

  const viewModes = [
    { id: "slider", icon: HiCollection, label: "Slider view", ariaLabel: "Slider view" },
    { id: "grid", icon: HiViewGrid, label: "Grid view", ariaLabel: "Grid view" },
  ];

  // Loading state until all data is loaded
  const isLoading = loading || newsLoading || categoriesLoading;

  const topTrendingBlogs = Array.isArray(blogs) 
    ? [...blogs]
        .sort((a, b) => (b.countOfVisitors || 0) - (a.countOfVisitors || 0))
        .slice(0, 6)
    : [];

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
    <div className="min-h-screen bg-white transition-colors duration-300">
      {/* Modern Hero Section */}
      <PageHero
        title="Welcome to Bloggy"
        description="Discover stories, insights, and ideas from our vibrant community of writers and readers"
        buttonText="Explore Blogs"
        buttonOnClick={() => navigate("/blog")}
      />

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
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      Trending Now
                    </h2>
                    <p className="text-gray-600 mt-1">
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
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      Latest News
                    </h2>
                    <p className="text-gray-600 mt-1 text-sm md:text-base">
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
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Trending Now
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Discover the most popular stories this week
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/blog")}
                    className="hidden md:flex items-center space-x-2 px-6 py-3 rounded-lg text-primary-600 hover:bg-primary-50 font-semibold transition-all hover:scale-105"
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
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      Latest News
                    </h2>
                    <p className="text-gray-600 mt-1 text-sm md:text-base">
                      Stay updated with the latest happenings from multiple sources
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-white rounded-xl p-1 shadow-lg border border-gray-200">
                    {viewModes.map((mode) => {
                      const Icon = mode.icon;
                      const isActive = viewMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setViewMode(mode.id)}
                          className={`p-2.5 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-primary-600 text-white shadow-md"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                          aria-label={mode.ariaLabel}
                          title={mode.label}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      );
                    })}
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white text-gray-700 hover:text-primary-600 hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        aria-label="Previous news"
                      >
                        <HiArrowRight className="w-5 h-5 rotate-180" />
                      </button>
                      <button
                        onClick={handleNextNews}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white text-gray-700 hover:text-primary-600 hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
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
                                  : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400 hover:scale-125"
                              }`}
                              aria-label={`Go to news ${index + 1}`}
                            >
                              {index === currentNewsIndex && (
                                <div className="absolute inset-0 bg-primary-400 rounded-full animate-pulse opacity-50"></div>
                              )}
                            </button>
                          ))}
                          {news.length > 15 && (
                            <span className="text-xs text-gray-500 ml-2">
                              +{news.length - 15} more
                            </span>
                          )}
                        </div>

                        {/* News Counter */}
                        <div className="flex items-center space-x-3 bg-white rounded-xl p-2 shadow-lg border border-gray-200">
                          <span className="px-4 py-1.5 text-sm font-semibold text-gray-700">
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
              <div className="absolute -inset-4 bg-gradient-to-r from-gray-200/50 to-gray-300/50 rounded-3xl blur-xl -z-10"></div>
              <div className="card p-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-50"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                    <HiNewspaper className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No News Available
                  </h3>
                  <p className="text-gray-500">
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
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import UpdateProfileModal from "../components/profile/UpdateProfileModal";
import MyBlogsContainer from "../components/profile/MyBlogsContainer";
import Footer from "../components/home/Footer";
import useCategoryCall from "../hooks/useCategoryCall";
import SkeletonLoader from "../components/global/SkeletonLoader";
import { formatDateOnly } from "../helper/formatDate";
import {
  HiLocationMarker,
  HiCalendar,
  HiPencil,
  HiUser,
  HiMail,
  HiHeart,
  HiEye,
  HiDocumentText,
  HiChatAlt,
} from "react-icons/hi";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.category);
  const { blogs } = useSelector((state) => state.blog);
  const { getCategory } = useCategoryCall();
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Loading state until categories are loaded
  const isLoading = categoriesLoading;

  const { image, username, email, bio, city, createdAt, firstName, lastName } =
    currentUser || {};

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const stats = useMemo(() => {
    if (!currentUser || !blogs) {
      return {
        totalBlogs: 0,
        totalLikes: 0,
        totalViews: 0,
        totalComments: 0,
      };
    }

    const userBlogs = blogs.filter((blog) => blog.userId?._id === currentUser._id);
    
    return {
      totalBlogs: userBlogs.length,
      totalLikes: userBlogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0),
      totalViews: userBlogs.reduce((sum, blog) => sum + (blog.countOfVisitors || 0), 0),
      totalComments: userBlogs.reduce((sum, blog) => {
        const comments = blog.comments || [];
        // Count only parent comments
        const parentComments = comments.filter(
          (c) => c && !c.parentCommentId && !c.parentId && !c.parentComment && !c.replyTo
        );
        return sum + parentComments.length;
      }, 0),
    };
  }, [blogs, currentUser]);

  const statsCards = useMemo(() => [
    {
      id: 'blogs',
      icon: HiDocumentText,
      value: stats.totalBlogs,
      label: 'Total Blogs',
      gradientFrom: 'from-primary-50',
      gradientTo: 'to-primary-100/50',
      darkGradientFrom: 'dark:from-primary-900/20',
      darkGradientTo: 'dark:to-primary-800/30',
      borderColor: 'border-primary-200/50',
      darkBorderColor: 'dark:border-primary-800/50',
      iconBgFrom: 'from-primary-500',
      iconBgTo: 'to-primary-600',
      textColor: 'text-primary-600',
      darkTextColor: 'dark:text-primary-400',
      circleBg: 'bg-primary-500/10',
    },
    {
      id: 'likes',
      icon: HiHeart,
      value: stats.totalLikes,
      label: 'Total Likes',
      gradientFrom: 'from-red-50',
      gradientTo: 'to-red-100/50',
      darkGradientFrom: 'dark:from-red-900/20',
      darkGradientTo: 'dark:to-red-800/30',
      borderColor: 'border-red-200/50',
      darkBorderColor: 'dark:border-red-800/50',
      iconBgFrom: 'from-red-500',
      iconBgTo: 'to-red-600',
      textColor: 'text-red-600',
      darkTextColor: 'dark:text-red-400',
      circleBg: 'bg-red-500/10',
    },
    {
      id: 'views',
      icon: HiEye,
      value: stats.totalViews,
      label: 'Total Views',
      gradientFrom: 'from-blue-50',
      gradientTo: 'to-blue-100/50',
      darkGradientFrom: 'dark:from-blue-900/20',
      darkGradientTo: 'dark:to-blue-800/30',
      borderColor: 'border-blue-200/50',
      darkBorderColor: 'dark:border-blue-800/50',
      iconBgFrom: 'from-blue-500',
      iconBgTo: 'to-blue-600',
      textColor: 'text-blue-600',
      darkTextColor: 'dark:text-blue-400',
      circleBg: 'bg-blue-500/10',
    },
    {
      id: 'comments',
      icon: HiChatAlt,
      value: stats.totalComments,
      label: 'Total Comments',
      gradientFrom: 'from-accent-50',
      gradientTo: 'to-accent-100/50',
      darkGradientFrom: 'dark:from-accent-900/20',
      darkGradientTo: 'dark:to-accent-800/30',
      borderColor: 'border-accent-200/50',
      darkBorderColor: 'dark:border-accent-800/50',
      iconBgFrom: 'from-accent-500',
      iconBgTo: 'to-accent-600',
      textColor: 'text-accent-600',
      darkTextColor: 'dark:text-accent-400',
      circleBg: 'bg-accent-500/10',
    },
  ], [stats]);

  const tabs = useMemo(() => [
    {
      id: 0,
      label: 'Posts',
      icon: HiDocumentText,
    },
    {
      id: 1,
      label: 'About',
      icon: HiUser,
    },
  ], []);

  useEffect(() => {
    getCategory("categories");
  }, []);

  if (!currentUser) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 pt-20 flex flex-col">
        {/* Cover Image Skeleton */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gradient-to-br from-primary-200 via-accent-200 to-primary-200 dark:from-primary-900/30 dark:via-accent-900/30 dark:to-primary-900/30 animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-12 flex-1 w-full">
          {/* Profile Card Skeleton */}
          <div className="relative overflow-visible rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-6 lg:p-10 mb-8 pt-28 md:pt-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
              {/* Avatar Skeleton */}
              <div className="relative -mt-24 md:-mt-28 mx-auto md:mx-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse border-4 border-white dark:border-gray-800"></div>
              </div>

              {/* Profile Info Skeleton */}
              <div className="flex-1 w-full space-y-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="flex items-center gap-6 mt-4">
                  <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                  <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
            ))}
          </div>

          {/* Tabs Skeleton */}
          <div className="relative mb-8">
            <div className="flex space-x-2 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="py-6 pb-20">
            <SkeletonLoader type="list" count={4} />
          </div>
        </div>

        <div className="relative z-10 mt-auto">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 pt-20 flex flex-col">
      {/* Modern Cover Image with animated gradient */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-accent-500 to-primary-600 dark:from-primary-700 dark:via-accent-700 dark:to-primary-800">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-12 flex-1 w-full">
        {/* Modern Profile Card with glassmorphism */}
        <div className="relative overflow-visible rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-6 lg:p-10 mb-8 pt-28 md:pt-8">
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-primary-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            {/* Avatar with modern design */}
            <div className="relative -mt-24 md:-mt-28 mx-auto md:mx-0">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                  {image ? (
                    <img
                      src={image}
                      alt={`${firstName} ${lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl md:text-5xl font-bold">
                      {firstName?.charAt(0).toUpperCase()}
                      {lastName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {/* Status indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg animate-pulse"></div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-accent-400 mb-2">
                    {firstName} {lastName}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-4 font-medium">
                    @{username}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                  {city && (
                    <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-colors">
                      <HiLocationMarker className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">{city}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-colors">
                    <HiCalendar className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Joined {formatDateOnly(createdAt, "long")}
                    </span>
                  </div>
                  {/* Modern Edit Button */}
                  <button
                    onClick={handleOpen}
                    className="group relative px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 hover:from-primary-700 hover:via-primary-600 hover:to-accent-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/50 hover:scale-105 active:scale-95 overflow-hidden shadow-lg"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <HiPencil className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Edit Profile</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} ${card.darkGradientFrom} ${card.darkGradientTo} border ${card.borderColor} ${card.darkBorderColor} p-6 hover:shadow-xl transition-all duration-300`}
              >
                <div className={`absolute top-0 right-0 w-20 h-20 ${card.circleBg} rounded-full -mr-10 -mt-10`}></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.iconBgFrom} ${card.iconBgTo} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className={`text-3xl font-bold ${card.textColor} ${card.darkTextColor} mb-1`}>{card.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{card.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modern Tabs */}
        <div className="relative mb-8">
          <div className="flex space-x-2 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tabValue === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTabValue(tab.id)}
                  className={`relative flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
                    isActive
                      ? "text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 animate-scale-in"></div>
                  )}
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-6 pb-20">
          <div className="relative">
            <div className={`transition-all duration-500 ease-in-out ${
              tabValue === 0 ? 'opacity-100 block' : 'opacity-0 hidden'
            }`}>
              <MyBlogsContainer userId={currentUser._id} />
            </div>
            <div className={`transition-all duration-500 ease-in-out ${
              tabValue === 1 ? 'opacity-100 block' : 'opacity-0 hidden'
            }`}>
              <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 lg:p-10">
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500/5 via-accent-500/5 to-primary-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
                
                <div className="flex items-center space-x-4 mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl blur-lg opacity-30"></div>
                    <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                      <HiUser className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-accent-400">
                    About
                  </h2>
                </div>
                <div className="space-y-8" data-about-section>
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-6 lg:p-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
                      <HiPencil className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <span>Biography</span>
                    </h3>
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base whitespace-pre-wrap break-words">
                        {bio || (
                          <span className="text-gray-500 dark:text-gray-400 italic">
                            This user hasn't written a bio yet.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-2">
                      <HiMail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      <span>Contact Information</span>
                    </h3>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-200/50 dark:border-primary-800/50 p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                          <HiMail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-auto">
        <Footer />
      </div>
      <UpdateProfileModal
        open={open}
        handleClose={handleClose}
        {...currentUser}
      />
    </div>
  );
};

export default Profile;
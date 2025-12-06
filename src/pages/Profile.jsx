import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UpdateProfileModal from "../components/profile/UpdateProfileModal";
import MyBlogsContainer from "../components/profile/MyBlogsContainer";
import Footer from "../components/home/Footer";
import useCategoryCall from "../hooks/useCategoryCall";
import SkeletonLoader from "../components/global/SkeletonLoader";
import {
  HiLocationMarker,
  HiCalendar,
  HiPencil,
  HiUser,
  HiMail,
} from "react-icons/hi";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.category);
  const { getCategory } = useCategoryCall();
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Categories yüklenene kadar loading state'i
  const isLoading = categoriesLoading;

  const { image, username, email, bio, city, createdAt, firstName, lastName } =
    currentUser || {};

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  useEffect(() => {
    getCategory("categories");
  }, []);

  if (!currentUser) {
    return null;
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-20 flex flex-col">
        {/* Cover Image Skeleton */}
        <div className="relative h-72 w-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 pb-12 flex-1">
          {/* Profile Card Skeleton */}
          <div className="relative overflow-visible md:overflow-hidden rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-6 lg:p-10 mb-8 pt-24 md:pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
              {/* Avatar Skeleton */}
              <div className="relative -mt-20 md:-mt-32 mx-auto md:mx-0">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-20 flex flex-col">
      {/* Modern Cover Image with animated gradient */}
      <div className="relative h-72 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-accent-600 to-primary-600">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 pb-12 flex-1">
        {/* Modern Profile Card with glassmorphism */}
        <div className="relative overflow-visible md:overflow-hidden rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-6 lg:p-10 mb-8 pt-24 md:pt-6">
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-primary-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            {/* Avatar with modern design */}
            <div className="relative -mt-20 md:-mt-32 mx-auto md:mx-0">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 shadow-2xl">
                  {image ? (
                    <img
                      src={image}
                      alt={`${firstName} ${lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">
                      {firstName?.charAt(0).toUpperCase()}
                      {lastName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {/* Status indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg"></div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-accent-400 mb-2">
                    {firstName} {lastName}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 font-medium">
                    @{username}
                  </p>
                  {bio && (
                    <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl leading-relaxed text-lg">
                      {bio}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    {city && (
                      <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                        <HiLocationMarker className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">{city}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                      <HiCalendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Joined{" "}
                        {new Date(createdAt).toLocaleString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modern Edit Button */}
                <button
                  onClick={handleOpen}
                  className="group relative px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 hover:from-primary-700 hover:via-primary-600 hover:to-accent-700 shadow-lg shadow-primary-500/50 hover:shadow-xl hover:shadow-primary-500/60 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/50 hover:scale-105 active:scale-95 overflow-hidden self-start md:self-auto"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <HiPencil className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Edit Profile</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Tabs */}
        <div className="relative mb-8">
          <div className="flex space-x-2 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/50 dark:border-gray-700/50">
            <button
              onClick={() => setTabValue(0)}
              className={`relative flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
                tabValue === 0
                  ? "text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              {tabValue === 0 && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 animate-scale-in"></div>
              )}
              <span className="relative z-10">Posts</span>
            </button>
            <button
              onClick={() => setTabValue(1)}
              className={`relative flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
                tabValue === 1
                  ? "text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              {tabValue === 1 && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 animate-scale-in"></div>
              )}
              <span className="relative z-10">About</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-6 pb-20">
          <div className="relative">
            <div className={`transition-opacity duration-300 ease-in-out ${
              tabValue === 0 ? 'opacity-100 block' : 'opacity-0 hidden'
            }`}>
              <MyBlogsContainer userId={currentUser._id} />
            </div>
            <div className={`transition-opacity duration-300 ease-in-out ${
              tabValue === 1 ? 'opacity-100 block' : 'opacity-0 hidden'
            }`}>
              <div className="relative overflow-hidden rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 lg:p-10">
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
                <div className="space-y-8">
                  <div className="relative overflow-hidden rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {bio || (
                        <span className="text-gray-500 dark:text-gray-400 italic">
                          This user hasn't written a bio yet.
                        </span>
                      )}
                    </p>
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
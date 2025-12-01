import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UpdateProfileModal from "../components/profile/UpdateProfileModal";
import MyBlogsContainer from "../components/profile/MyBlogsContainer";
import Footer from "../components/home/Footer";
import useCategoryCall from "../hooks/useCategoryCall";
import {
  HiLocationMarker,
  HiCalendar,
  HiPencil,
  HiUser,
  HiMail,
} from "react-icons/hi";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { getCategory } = useCategoryCall();
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-20 flex flex-col">
      {/* Cover Image */}
      <div className="relative h-64 w-full bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-12 flex-1">
        {/* Profile Card */}
        <div className="card p-6 lg:p-8 mb-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar */}
            <div className="relative -mt-20 md:-mt-24">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500">
                {image ? (
                  <img
                    src={image}
                    alt={`${firstName} ${lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {firstName?.charAt(0).toUpperCase()}
                    {lastName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {firstName} {lastName}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    @{username}
                  </p>
                  {bio && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-2xl">
                      {bio}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {city && (
                      <div className="flex items-center space-x-2">
                        <HiLocationMarker className="w-4 h-4" />
                        <span>{city}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <HiCalendar className="w-4 h-4" />
                      <span>
                        Joined{" "}
                        {new Date(createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={handleOpen}
                  className="btn-secondary flex items-center space-x-2 self-start md:self-auto"
                >
                  <HiPencil className="w-5 h-5" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setTabValue(0)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                tabValue === 0
                  ? "border-primary-600 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setTabValue(1)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                tabValue === 1
                  ? "border-primary-600 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              About
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {tabValue === 0 && (
            <div>
              <MyBlogsContainer userId={currentUser._id} />
            </div>
          )}
          {tabValue === 1 && (
            <div className="card p-8">
              <div className="flex items-center space-x-3 mb-6">
                <HiUser className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  About
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {bio || "This user hasn't written a bio yet."}
                  </p>
                </div>
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <HiMail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <UpdateProfileModal
        open={open}
        handleClose={handleClose}
        {...currentUser}
      />
    </div>
  );
};

export default Profile;
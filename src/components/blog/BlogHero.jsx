import { useState } from "react";
import { formatDateTime } from "../../helper/formatDate";
import {
  HiHeart,
  HiOutlineHeart,
  HiChatAlt,
  HiEye,
  HiDotsVertical,
  HiPencil,
  HiLink,
  HiClock,
} from "react-icons/hi";
import DeleteBlog from "./DeleteBlog";

const BlogHero = ({
  image,
  title,
  userId,
  createdAt,
  content,
  likes,
  liked,
  countOfVisitors,
  commentsCount,
  isCurrentUserOwner,
  onLike,
  onCopyLink,
  onEdit,
  blogId,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    {
      id: "copyLink",
      icon: HiLink,
      label: "Copy Link",
      onClick: () => {
        onCopyLink();
        setMenuOpen(false);
      },
      show: true,
    },
    {
      id: "editBlog",
      icon: HiPencil,
      label: "Edit Blog",
      onClick: () => {
        onEdit();
        setMenuOpen(false);
      },
      show: isCurrentUserOwner,
    },
  ];

  const calculateReadingTime = () => {
    if (!content) return "1 min";
    const text = content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const handleScrollToComments = () => {
    document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full h-[60vh] min-h-[500px] max-h-[700px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200";
        }}
      />

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-5xl mx-auto w-full">
          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 bg-gradient-to-br from-primary-400 to-accent-500 shrink-0">
              {userId?.image ? (
                <img
                  src={userId.image}
                  alt={`${userId.firstName} ${userId.lastName}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                  {userId?.firstName?.charAt(0)?.toUpperCase() || "U"}
                  {userId?.lastName?.charAt(0)?.toUpperCase() || ""}
                </div>
              )}
            </div>
            <div className="text-white">
              <p className="font-semibold text-lg">
                {userId?.firstName} {userId?.lastName}
              </p>
              <div className="flex items-center space-x-3 text-sm text-white/80">
                <span>{formatDateTime(createdAt)}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <HiClock className="w-4 h-4" />
                  <span>{calculateReadingTime()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            {title}
          </h1>

          {/* Stats */}
          <div className="flex items-center space-x-6 text-white/90">
            <button
              onClick={onLike}
              className="flex items-center space-x-2 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400/50 rounded-lg p-1"
              aria-label={liked ? "Unlike this blog" : "Like this blog"}
            >
              {liked ? (
                <HiHeart className="w-6 h-6 text-red-400" />
              ) : (
                <HiOutlineHeart className="w-6 h-6" />
              )}
              <span className="font-medium">{likes.length}</span>
            </button>

            <button
              onClick={handleScrollToComments}
              className="flex items-center space-x-2 hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300/50 rounded-lg p-1"
              aria-label="Scroll to comments"
            >
              <HiChatAlt className="w-6 h-6" />
              <span className="font-medium">{commentsCount || 0}</span>
            </button>

            <div className="flex items-center space-x-2">
              <HiEye className="w-6 h-6" />
              <span className="font-medium">{countOfVisitors ?? 0}</span>
            </div>

            {/* Menu */}
            <div className="relative ml-auto">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="More options"
                aria-expanded={menuOpen}
              >
                <HiDotsVertical className="w-6 h-6 text-white" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 max-h-[90vh] overflow-y-auto">
                    {menuItems.map((item, index) => {
                      if (!item.show) return null;
                      const Icon = item.icon;
                      return (
                        <div key={item.id}>
                          {index > 0 && (
                            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                          )}
                          <button
                            onClick={item.onClick}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </button>
                        </div>
                      );
                    })}
                    {isCurrentUserOwner && (
                      <>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                        <DeleteBlog id={blogId} isMenuItem={true} />
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;


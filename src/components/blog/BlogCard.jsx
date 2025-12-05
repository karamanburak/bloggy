import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  MdArrowOutward, 
  MdAccessTime,
  MdFavorite,
  MdFavoriteBorder,
  MdVisibility,
  MdChatBubbleOutline
} from "react-icons/md";
import { HiTag } from "react-icons/hi";

const BlogCard = ({
  _id,
  content,
  image,
  title,
  userId,
  createdAt,
  likes,
  countOfVisitors,
  categoryId,
  comments,
}) => {
  const navigate = useNavigate();
  const [readingTime, setReadingTime] = useState(null);
  const { currentUser } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category);
  const [liked, setLiked] = useState(false);

  const getCategoryName = () => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((cat) => cat._id === categoryId._id);
    return category ? category.name : "Uncategorized";
  };

  // Helper function to extract parent ID from comment (same logic as Detail page)
  const getParentId = (comment) => {
    if (!comment) return null;
    
    // Try different field names - check all possible variations
    let parentId = comment.parentCommentId || comment.parentId || comment.parentComment || comment.replyTo || comment.parent;
    
    // If it's a string, return it (but check if it's not empty)
    if (typeof parentId === 'string' && parentId.trim() !== '' && parentId !== 'null' && parentId !== 'undefined') {
      return parentId;
    }
    
    // If it's an object, extract the ID
    if (typeof parentId === 'object' && parentId !== null) {
      const extractedId = parentId._id || parentId.id || null;
      if (extractedId && typeof extractedId === 'string' && extractedId.trim() !== '') {
        return extractedId;
      }
    }
    
    // Also check if comment has a populated parentComment field
    if (comment.parentComment && typeof comment.parentComment === 'object') {
      return comment.parentComment._id || comment.parentComment.id || null;
    }
    
    return null;
  };

  // Count only parent comments (not replies)
  const getParentCommentCount = () => {
    if (!Array.isArray(comments)) return 0;
    return comments.filter(comment => {
      const parentId = getParentId(comment);
      // A comment is a parent if it has no parentId or parentId is empty/null
      return !parentId;
    }).length;
  };

  useEffect(() => {
    if (currentUser && Array.isArray(likes) && likes.includes(currentUser._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }

    if (content) {
      const words = content.split(" ").length;
      const minutes = Math.ceil(words / 150);
      if (minutes >= 1) {
        setReadingTime(`${minutes} min read`);
      }
    }
  }, [likes, currentUser, content]);

  const { image: userImage, firstName, lastName } = userId || { firstName: "Unknown", lastName: "User" };

  const handleCardClick = () => {
    navigate(`/blog/detail/${_id}`, {
      state: {
        _id,
        content,
        image,
        title,
        userId,
        createdAt,
        likes,
        countOfVisitors,
        categoryId,
        readingTime,
      },
    });
  };

  // Strip HTML tags for preview
  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const previewText = stripHtml(content).substring(0, 120) + "...";

  return (
    <article
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      tabIndex={0}
      role="article"
      aria-label={`Blog post: ${title}`}
      className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <img
          src={image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (e.target.src !== "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800") {
              e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800";
            }
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Category Badge - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full text-xs font-bold text-primary-600 dark:text-primary-400 shadow-lg">
            <HiTag className="w-3 h-3" />
            <span>{getCategoryName()}</span>
          </span>
        </div>

        {/* Reading Time - Top Right */}
        {readingTime && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium">
              <MdAccessTime className="w-3.5 h-3.5" />
              <span>{readingTime}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 min-h-[3.5rem]">
          {title}
        </h3>
        
        {/* Preview Text */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {previewText}
        </p>

        {/* Author & Date */}
        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-400 to-accent-500 flex-shrink-0">
            {userImage ? (
              <img
                src={userImage}
                alt={`${firstName} ${lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
                {(firstName?.charAt(0) || "U").toUpperCase()}
                {(lastName?.charAt(0) || "").toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {firstName || "Unknown"} {lastName || ""}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {createdAt ? new Date(createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }) : "Recently"}
            </p>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1.5">
              {liked ? (
                <MdFavorite className="w-5 h-5 text-red-500" />
              ) : (
                <MdFavoriteBorder className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{Array.isArray(likes) ? likes.length : 0}</span>
            </div>
            
            <div className="flex items-center space-x-1.5">
              <MdChatBubbleOutline className="w-5 h-5" />
              <span className="text-sm font-medium">{getParentCommentCount()}</span>
            </div>
            
            <div className="flex items-center space-x-1.5">
              <MdVisibility className="w-5 h-5" />
              <span className="text-sm font-medium">{countOfVisitors || 0}</span>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                handleCardClick();
              }
            }}
            aria-label={`Read blog: ${title}`}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-all duration-300 group/read focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <span className="text-sm font-semibold">Read</span>
            <MdArrowOutward className="w-4 h-4 group-hover/read:translate-x-0.5 group-hover/read:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
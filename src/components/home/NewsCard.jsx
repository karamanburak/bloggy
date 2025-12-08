import { MdArrowOutward } from "react-icons/md";
import { HiCalendar, HiClock, HiExternalLink } from "react-icons/hi";
import { useState } from "react";
import { formatDateOnly } from "../../helper/formatDate";

const defaultImage =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop";

const NewsCard = ({ title, url, image, content, publishedAt, source, description, author }) => {
  const [imageError, setImageError] = useState(false);

  const handleReadMore = () => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const formattedDate = formatDateOnly(publishedAt, "short");

  const timeAgo = publishedAt
    ? (() => {
        const now = new Date();
        const published = new Date(publishedAt);
        const diffInSeconds = Math.floor((now - published) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        
        if (diffInSeconds < 60) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return formattedDate;
      })()
    : "";

  const displayContent = description || content || "";
  const truncatedContent = displayContent.length > 120 
    ? displayContent.substring(0, 120) + "..." 
    : displayContent;

  const sourceName = source?.name || "News Source";

  return (
    <article className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-primary-300 h-full flex flex-col">
      {/* Image Section with Overlay */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
        <img
          src={imageError ? defaultImage : (image || defaultImage)}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Source Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></span>
            {sourceName}
          </span>
        </div>

        {/* Time Badge */}
        {timeAgo && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
              <HiClock className="w-3 h-3" />
              {timeAgo}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow min-h-0">
        {/* Date */}
        {formattedDate && (
          <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-500">
            <HiCalendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
            {author && (
              <>
                <span className="mx-1">•</span>
                <span className="text-gray-400">{author}</span>
              </>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        {truncatedContent && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
            {truncatedContent}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 font-medium">Live</span>
          </div>
          <button
            onClick={handleReadMore}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-semibold hover:from-primary-700 hover:to-accent-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            aria-label="Read full article"
          >
            <span>Read More</span>
            <HiExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-primary-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
    </article>
  );
};

export default NewsCard;
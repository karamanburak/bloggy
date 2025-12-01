import { MdArrowOutward } from "react-icons/md";
import { HiCalendar, HiClock } from "react-icons/hi";

const defaultImage =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop";

const NewsCard = ({ title, url, image, content, publishedAt, source, description }) => {
  const handleReadMore = () => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const timeAgo = publishedAt
    ? (() => {
        const now = new Date();
        const published = new Date(publishedAt);
        const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));
        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return formattedDate;
      })()
    : "";

  const displayContent = description || content || "";
  const truncatedContent = displayContent.length > 150 
    ? displayContent.substring(0, 150) + "..." 
    : displayContent;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-2/5 h-64 lg:h-auto relative overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={image || defaultImage}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
          {/* Breaking News Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              • BREAKING NEWS
            </span>
          </div>
          {/* Source Badge */}
          {source?.name && (
            <div className="absolute bottom-4 left-4">
              <span className="bg-gray-900/80 text-white text-xs font-medium px-3 py-1 rounded-lg">
                {source.name}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="lg:w-3/5 flex flex-col justify-between p-6 lg:p-8">
          <div>
            {/* Date & Time */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <HiCalendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              {timeAgo && (
                <div className="flex items-center gap-1.5">
                  <HiClock className="w-4 h-4" />
                  <span>{timeAgo}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
              {title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-6">
              {truncatedContent || "No description available."}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Live Update</span>
            </div>
            <button
              onClick={handleReadMore}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
              aria-label="Read full article"
            >
              <span>Read Full Article</span>
              <MdArrowOutward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
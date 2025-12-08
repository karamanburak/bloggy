import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import SocialShare from "./SocialShare";
import { HiArrowLeft } from "react-icons/hi";

const BlogContent = ({ content, title, image, blogId }) => {
  const navigate = useNavigate();
  // Memoize sanitized content to avoid re-sanitizing on every render
  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(content || "");
  }, [content]);

  return (
    <div className="w-full pt-12 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button in Content Section */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer"
            aria-label="Go back"
          >
            <HiArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          {/* Social Share */}
          <div className="flex justify-end">
            <SocialShare content={content} image={image} title={title} />
          </div>
        </div>

        {/* Article Content */}
        <article
          className="prose prose-lg max-w-none mb-12 text-gray-700 leading-relaxed prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600 prose-strong:text-gray-900 prose-img:rounded-2xl prose-img:shadow-xl"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    </div>
  );
};

export default BlogContent;


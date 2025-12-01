import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useBlogCall from "../hooks/useBlogCall";
import useCategoryCall from "../hooks/useCategoryCall";
import CommentForm from "../components/blog/CommentForm";
import SocialShare from "../components/blog/SocialShare";
import DeleteBlog from "../components/blog/DeleteBlog";
import EditBlogModal from "../components/blog/EditBlogModal";
import {
  HiHeart,
  HiOutlineHeart,
  HiChatAlt,
  HiEye,
  HiDotsVertical,
  HiPencil,
  HiLink,
  HiArrowLeft,
  HiClock,
} from "react-icons/hi";
import DOMPurify from "dompurify";

const Detail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getBlogDetail, postLike } = useBlogCall();
  const { currentUser } = useSelector((state) => state.auth);
  const { blog } = useSelector((state) => state.blog);
  const { categories } = useSelector((state) => state.category);
  const { getCategory } = useCategoryCall();

  const {
    content,
    image,
    createdAt,
    userId,
    title,
    _id,
    likes: initialLikes,
    categoryId,
    countOfVisitors,
  } = state || {};

  const [likes, setLikes] = useState(initialLikes || []);
  const [liked, setLiked] = useState(
    currentUser && (initialLikes || []).includes(currentUser._id)
  );
  const [showComments, setShowComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const isCurrentUserOwner = currentUser && userId?._id === currentUser._id;

  const getCategoryName = () => {
    const category = categories.find((cat) => cat._id === categoryId?._id);
    return category ? category.name : "Unknown Category";
  };

  useEffect(() => {
    if (currentUser && likes.includes(currentUser._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    if (!categories.length) {
      getCategory("categories");
    }
    if (_id) {
      getBlogDetail("blogs", _id);
    }
  }, [_id, currentUser, likes, categories.length]);

  const handleLike = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    postLike("blogs", _id);
    setLiked(!liked);
    setLikes((prevLikes) =>
      liked
        ? prevLikes.filter((id) => id !== currentUser._id)
        : [...prevLikes, currentUser._id]
    );
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/blog/detail/${_id}`;
    navigator.clipboard.writeText(link);
    setMenuOpen(false);
    // You might want to show a toast notification here
  };

  const sanitizedContent = DOMPurify.sanitize(content || "");

  const calculateReadingTime = () => {
    if (!content) return "1 min";
    const text = content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Blog not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Image Section - Full Width */}
      <div className="relative w-full h-[60vh] min-h-[500px] max-h-[700px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-gray-900/30 backdrop-blur-md rounded-lg text-white hover:bg-white/20 dark:hover:bg-gray-900/50 transition-all duration-300 border border-white/20"
        >
          <HiArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Category Badge */}
        <div className="absolute top-6 right-6 z-20">
          <span className="px-4 py-2 bg-white/10 dark:bg-gray-900/30 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/20">
            {getCategoryName()}
          </span>
        </div>

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
                  <span>
                    {new Date(createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
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
                onClick={handleLike}
                className="flex items-center space-x-2 hover:text-red-400 transition-colors"
              >
                {liked ? (
                  <HiHeart className="w-6 h-6 text-red-400" />
                ) : (
                  <HiOutlineHeart className="w-6 h-6" />
                )}
                <span className="font-medium">{likes.length}</span>
              </button>

              <button
                onClick={() => {
                  setShowComments(!showComments);
                  setTimeout(() => {
                    document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="flex items-center space-x-2 hover:text-primary-300 transition-colors"
              >
                <HiChatAlt className="w-6 h-6" />
                <span className="font-medium">{blog?.comments?.length || 0}</span>
              </button>

              <div className="flex items-center space-x-2">
                <HiEye className="w-6 h-6" />
                <span className="font-medium">{countOfVisitors + 1}</span>
              </div>

              {/* Menu */}
              <div className="relative ml-auto">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <HiDotsVertical className="w-6 h-6 text-white" />
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <HiLink className="w-4 h-4" />
                        <span>Copy Link</span>
                      </button>
                      {isCurrentUserOwner && (
                        <>
                          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                          <button
                            onClick={() => {
                              setOpenEditModal(true);
                              setMenuOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <HiPencil className="w-4 h-4" />
                            <span>Edit Blog</span>
                          </button>
                          <DeleteBlog id={_id} isMenuItem={true} />
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

      {/* Content Section - Full Width with Max Width for Readability */}
      <div className="w-full pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Social Share */}
          <div className="flex justify-end mb-8">
            <SocialShare content={content} image={image} title={title} />
          </div>

          {/* Article Content */}
          <article
            className="prose prose-lg dark:prose-invert max-w-none mb-12 text-gray-700 dark:text-gray-300 leading-relaxed prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-img:rounded-2xl prose-img:shadow-xl"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* Comments Section */}
          <div id="comments-section" className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            {currentUser && (
              <div className="mb-12">
                <CommentForm blogId={_id} userId={currentUser._id} />
              </div>
            )}

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Comments ({blog?.comments?.length || 0})
              </h2>
              {!showComments && blog?.comments?.length > 0 && (
                <button
                  onClick={() => setShowComments(true)}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                >
                  Show Comments
                </button>
              )}
            </div>

            {showComments && (
              <div className="space-y-6">
                {blog?.comments?.length > 0 ? (
                  blog.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 shrink-0">
                          {comment?.userId?.image ? (
                            <img
                              src={comment.userId.image}
                              alt={`${comment.userId.firstName} ${comment.userId.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                              {comment.userId.firstName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {comment.userId.firstName} {comment.userId.lastName}
                            </h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                    <HiChatAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      No comments yet. Be the first to comment!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {openEditModal && (
        <EditBlogModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          blog={state}
          initialState={{
            title: title,
            content: content,
            image: image,
          }}
        />
      )}
    </div>
  );
};

export default Detail;
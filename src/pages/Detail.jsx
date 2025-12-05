import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useBlogCall from "../hooks/useBlogCall";
import useCategoryCall from "../hooks/useCategoryCall";
import CommentForm from "../components/blog/CommentForm";
import SocialShare from "../components/blog/SocialShare";
import DeleteBlog from "../components/blog/DeleteBlog";
import EditBlogModal from "../components/blog/EditBlogModal";
import { toastSuccessNotify } from "../helper/ToastNotify";
import { getBlogDetailSuccess } from "../features/blogSlice";
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
  HiTrash,
  HiX,
  HiChevronDown,
  HiChevronUp,
  HiThumbUp,
  HiThumbDown,
  HiOutlineThumbUp,
  HiOutlineThumbDown,
} from "react-icons/hi";
import DOMPurify from "dompurify";

const Detail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getBlogDetail, postLike, deleteComment, updateComment, postCommentLike, postCommentDislike, refreshComments } = useBlogCall();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { blog } = useSelector((state) => state.blog);
  const { categories } = useSelector((state) => state.category);
  const { getCategory } = useCategoryCall();

  // Use Redux store blog data if available and ID matches, otherwise use state from location
  const blogData = blog?._id === state?._id ? blog : state;
  
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
  } = blogData || {};

  const [likes, setLikes] = useState(initialLikes || []);
  const [liked, setLiked] = useState(
    currentUser && (initialLikes || []).includes(currentUser._id)
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [commentSort, setCommentSort] = useState("newest"); // newest, oldest, mostLiked, leastLiked
  const [replySort, setReplySort] = useState("newest"); // newest, oldest, mostLiked, leastLiked

  const isCurrentUserOwner = currentUser && userId?._id === currentUser._id;

  // Update local state when Redux store blog data changes
  useEffect(() => {
    if (blog?._id === _id && blog) {
      setLikes(blog.likes || []);
      if (currentUser && (blog.likes || []).includes(currentUser._id)) {
        setLiked(true);
      } else {
        setLiked(false);
      }
      
    }
  }, [blog, _id, currentUser]);

  const getCategoryName = () => {
    const category = categories.find((cat) => cat._id === categoryId?._id);
    return category ? category.name : "Unknown Category";
  };

  // Track if this is the first load to prevent duplicate view count increments
  const isFirstLoad = useRef(true);
  
  // Separate useEffect for blog detail and view count
  useEffect(() => {
    if (!_id) return;
    
    const storageKey = `blog_viewed_${_id}`;
    const hasViewed = sessionStorage.getItem(storageKey);
    
    // Backend's getBlogDetail auto-increments view count on every call
    // So we only call it once per session (first visit)
    // For subsequent visits, we only refresh comments without calling getBlogDetail
    
    if (!hasViewed && isFirstLoad.current) {
      // First visit: getBlogDetail will increment view count
      sessionStorage.setItem(storageKey, "true");
      isFirstLoad.current = false;
      getBlogDetail("blogs", _id);
    } else if (hasViewed) {
      // Already viewed: only refresh comments without calling getBlogDetail
      // This prevents view count from incrementing again
      refreshComments(_id).then(comments => {
        if (comments && blog && blog._id === _id) {
          dispatch(getBlogDetailSuccess({
            data: {
              ...blog,
              comments: comments
            }
          }));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  // Separate useEffect for categories
  useEffect(() => {
    if (!categories.length) {
      getCategory("categories");
    }
  }, [categories.length, getCategory]);

  // Separate useEffect for likes state
  useEffect(() => {
    if (currentUser && likes.includes(currentUser._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [currentUser, likes]);

  // Auto-expand replies when comments are loaded
  useEffect(() => {
    if (!blog?.comments || !Array.isArray(blog.comments)) return;
    
    const validComments = blog.comments.filter(comment => {
      if (!comment || typeof comment !== 'object') return false;
      if (!comment._id || !comment.comment || !comment.userId) return false;
      if (typeof comment.userId !== 'object' || !comment.userId._id) return false;
      return true;
    });
    
    const getParentId = (comment) => {
      let parentId = comment.parentCommentId || comment.parentId || comment.parentComment || comment.replyTo || comment.parent;
      if (typeof parentId === 'string' && parentId.trim() !== '' && parentId !== 'null' && parentId !== 'undefined') {
        return parentId;
      }
      if (typeof parentId === 'object' && parentId !== null) {
        const extractedId = parentId._id || parentId.id || null;
        if (extractedId && typeof extractedId === 'string' && extractedId.trim() !== '') {
          return extractedId;
        }
      }
      if (comment.parentComment && typeof comment.parentComment === 'object') {
        return comment.parentComment._id || comment.parentComment.id || null;
      }
      return null;
    };
    
    const compareIds = (id1, id2) => {
      if (!id1 || !id2) return false;
      return String(id1).trim() === String(id2).trim();
    };
    
    const parentComments = validComments.filter(comment => {
      const parentId = getParentId(comment);
      return !parentId;
    });
    
    const replies = validComments.filter(comment => {
      const parentId = getParentId(comment);
      return parentId && parentId !== '';
    });
    
    // Find comments with replies and auto-expand them
    const commentsWithReplies = parentComments.filter(comment => {
      const commentReplies = replies.filter(reply => {
        const replyParentId = getParentId(reply);
        if (!replyParentId) return false;
        return compareIds(replyParentId, comment._id);
      });
      return commentReplies.length > 0;
    });
    
    // Auto-expand replies for comments that have them - use functional update to avoid dependency issues
    if (commentsWithReplies.length > 0) {
      setExpandedReplies(prev => {
        const newExpanded = new Set(prev);
        let hasChanges = false;
        commentsWithReplies.forEach(comment => {
          if (!newExpanded.has(comment._id)) {
            newExpanded.add(comment._id);
            hasChanges = true;
          }
        });
        return hasChanges ? newExpanded : prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blog?.comments]);



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

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/blog/detail/${_id}`;
    try {
      await navigator.clipboard.writeText(link);
      setMenuOpen(false);
      toastSuccessNotify("Link copied to clipboard!");
    } catch (err) {
      // Error copying link
    }
  };

  const sanitizedContent = DOMPurify.sanitize(content || "");

  const calculateReadingTime = () => {
    if (!content) return "1 min";
    const text = content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (!blogData) {
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
          loading="eager"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200";
          }}
        />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-gray-900/30 backdrop-blur-md rounded-lg text-white hover:bg-white/20 dark:hover:bg-gray-900/50 transition-all duration-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Go back"
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
                    {new Date(createdAt).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
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
                onClick={() => {
                  document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center space-x-2 hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300/50 rounded-lg p-1"
                aria-label="Scroll to comments"
              >
                <HiChatAlt className="w-6 h-6" />
                              <span className="font-medium">
                  {blog?.comments?.filter(c => 
                    c && typeof c === 'object' && 
                    !c.parentCommentId && !c.parentId && !c.parentComment && !c.replyTo
                  ).length || 0}
                </span>
              </button>

              <div className="flex items-center space-x-2">
                <HiEye className="w-6 h-6" />
                <span className="font-medium">{blog?.countOfVisitors ?? countOfVisitors ?? 0}</span>
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
                      <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
          {/* Back Button in Content Section */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/50"
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
            className="prose prose-lg dark:prose-invert max-w-none mb-12 text-gray-700 dark:text-gray-300 leading-relaxed prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-img:rounded-2xl prose-img:shadow-xl"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* Comments Section */}
          <div id="comments-section" className="mt-16 pt-12 border-t border-gray-200/50 dark:border-gray-700/50">
            {currentUser && (
              <div className="mb-12">
                <CommentForm blogId={_id} userId={currentUser._id} />
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl blur-lg opacity-30"></div>
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                    <HiChatAlt className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Comments
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {blog?.comments?.filter(c => 
                      c && typeof c === 'object' && 
                      !c.parentCommentId && !c.parentId && !c.parentComment && !c.replyTo
                    ).length || 0} {blog?.comments?.filter(c => 
                      c && typeof c === 'object' && 
                      !c.parentCommentId && !c.parentId && !c.parentComment && !c.replyTo
                    ).length === 1 ? "comment" : "comments"}
                  </p>
                </div>
              </div>
              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Sort:</label>
                <select
                  value={commentSort}
                  onChange={(e) => setCommentSort(e.target.value)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="mostLiked">Most Liked</option>
                  <option value="leastLiked">Least Liked</option>
                </select>
              </div>
            </div>

            {/* Comments List - Always Visible */}
            <div className="space-y-0">
              {blog?.comments?.length > 0 ? (() => {
                // First, filter out comments that are just IDs (strings) instead of objects
                // Only process comments that are actual objects with the expected structure
                const validComments = blog.comments.filter(comment => {
                  // Check if comment is an object (not a string/ID)
                  if (!comment || typeof comment !== 'object') {
                    return false;
                  }
                  // Check if comment has required fields
                  if (!comment._id || !comment.comment || !comment.userId) {
                    return false;
                  }
                  // Check if userId is populated (object, not just an ID string)
                  if (typeof comment.userId !== 'object' || !comment.userId._id) {
                    return false;
                  }
                  return true;
                });
                
                // Helper function to extract parent ID from comment
                const getParentId = (comment) => {
                  // Try different field names - check all possible variations
                  // Backend uses parentCommentId field
                  let parentId = comment.parentCommentId || comment.parentId || comment.parentComment || comment.replyTo || comment.parent;
                  
                  // If it's a string, return it (but check if it's not empty)
                  if (typeof parentId === 'string' && parentId.trim() !== '' && parentId !== 'null' && parentId !== 'undefined') {
                    return parentId;
                  }
                  
                  // If it's an object, extract the ID
                  if (typeof parentId === 'object' && parentId !== null) {
                    const extractedId = parentId._id || parentId.id || null;
                    if (extractedId) {
                      // Convert to string if it's not already
                      return String(extractedId).trim();
                    }
                  }
                  
                  // Also check if comment has a populated parentComment field
                  if (comment.parentComment && typeof comment.parentComment === 'object') {
                    const id = comment.parentComment._id || comment.parentComment.id || null;
                    return id ? String(id).trim() : null;
                  }
                  
                  return null;
                };
                
                // Helper function to compare IDs
                const compareIds = (id1, id2) => {
                  if (!id1 || !id2) return false;
                  // Convert both to strings and compare
                  return String(id1).trim() === String(id2).trim();
                };
                
                // Sort helper function
                const sortComments = (comments, sortType) => {
                  const sorted = [...comments];
                  switch (sortType) {
                    case "newest":
                      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    case "oldest":
                      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    case "mostLiked":
                      return sorted.sort((a, b) => {
                        // Handle both populated (array of objects) and unpopulated (array of IDs) likes
                        const aLikes = Array.isArray(a.likes) ? a.likes.length : 0;
                        const bLikes = Array.isArray(b.likes) ? b.likes.length : 0;
                        // Calculate net likes (likes - dislikes)
                        const aDislikes = Array.isArray(a.dislikes) ? a.dislikes.length : 0;
                        const bDislikes = Array.isArray(b.dislikes) ? b.dislikes.length : 0;
                        const aNet = aLikes - aDislikes;
                        const bNet = bLikes - bDislikes;
                        if (aNet !== bNet) return bNet - aNet;
                        // If net likes are equal, sort by newest
                        return new Date(b.createdAt) - new Date(a.createdAt);
                      });
                    case "leastLiked":
                      return sorted.sort((a, b) => {
                        // Handle both populated (array of objects) and unpopulated (array of IDs) likes
                        const aLikes = Array.isArray(a.likes) ? a.likes.length : 0;
                        const bLikes = Array.isArray(b.likes) ? b.likes.length : 0;
                        // Calculate net likes (likes - dislikes)
                        const aDislikes = Array.isArray(a.dislikes) ? a.dislikes.length : 0;
                        const bDislikes = Array.isArray(b.dislikes) ? b.dislikes.length : 0;
                        const aNet = aLikes - aDislikes;
                        const bNet = bLikes - bDislikes;
                        if (aNet !== bNet) return aNet - bNet;
                        // If net likes are equal, sort by newest
                        return new Date(b.createdAt) - new Date(a.createdAt);
                      });
                    default:
                      return sorted;
                  }
                };
                
                // Separate parent comments and replies
                let parentComments = validComments.filter(comment => {
                  const parentId = getParentId(comment);
                  // A comment is a parent if it has no parentId or parentId is empty/null
                  return !parentId;
                });
                
                let replies = validComments.filter(comment => {
                  const parentId = getParentId(comment);
                  // A comment is a reply if it has a valid parentId
                  return parentId && parentId !== '';
                });
                
                // Sort parent comments
                parentComments = sortComments(parentComments, commentSort);
                
                // Sort replies (newest first by default for replies)
                replies = sortComments(replies, replySort);
                
                return parentComments.map((comment, index) => {
                  const isCommentOwner = currentUser && comment?.userId?._id === currentUser._id;
                  const isEditing = editingComment === comment._id;
                  
                  // Filter replies for this comment
                  let commentReplies = replies.filter(reply => {
                    const replyParentId = getParentId(reply);
                    const commentId = String(comment._id); // Ensure it's a string
                    
                    // If no parentId found, it's not a reply to this comment
                    if (!replyParentId) {
                      return false;
                    }
                    
                    // Compare as strings
                    const replyParentIdStr = String(replyParentId).trim();
                    const commentIdStr = String(commentId).trim();
                    const matches = replyParentIdStr === commentIdStr;
                    
                    return matches;
                  });
                  
                  // Sort comment replies based on replySort (newest first by default)
                  commentReplies = sortComments(commentReplies, replySort);
                  
                  const hasReplies = commentReplies.length > 0;
                  
                  return (
                    <div key={comment._id}>
                      <div
                        className={`flex items-start space-x-3 animate-fade-in py-4 ${
                          index !== parentComments.length - 1 || hasReplies
                            ? "border-b border-gray-200 dark:border-gray-700" 
                            : ""
                        }`}
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        {/* Avatar - YouTube Style */}
                        <div className="shrink-0">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500">
                            {comment?.userId?.image ? (
                              <img
                                src={comment.userId.image}
                                alt={`${comment.userId.firstName} ${comment.userId.lastName}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
                                {comment?.userId?.firstName?.charAt(0)?.toUpperCase() || "U"}
                                {comment?.userId?.lastName?.charAt(0)?.toUpperCase() || ""}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Comment Content - YouTube Style */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                {comment?.userId?.firstName || "Unknown"} {comment?.userId?.lastName || ""}
                              </h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(comment.createdAt).toLocaleString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                            {/* Edit/Delete Menu for Comment Owner */}
                            {isCommentOwner && !isEditing && (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setEditingComment(comment._id)}
                                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                  aria-label="Edit comment"
                                >
                                  <HiPencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setCommentToDelete(comment._id)}
                                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                  aria-label="Delete comment"
                                >
                                  <HiTrash className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {isEditing ? (
                            <div className="mt-2">
                              <CommentForm
                                blogId={_id}
                                userId={currentUser._id}
                                commentId={comment._id}
                                initialText={comment.comment}
                                isEdit={true}
                                onCancel={(comments) => {
                                  setEditingComment(null);
                                  // Update Redux store with refreshed comments
                                  if (comments && blog && blog._id === _id) {
                                    dispatch(getBlogDetailSuccess({
                                      data: {
                                        ...blog,
                                        comments: comments
                                      }
                                    }));
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-2">
                                {comment.comment}
                              </p>
                              {/* Action Buttons - YouTube Style */}
                              <div className="flex items-center space-x-4 mt-2">
                                {/* Like/Dislike Buttons */}
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={async () => {
                                      if (currentUser) {
                                        const comments = await postCommentLike(comment._id, _id);
                                        // Update Redux store with refreshed comments
                                        if (comments && blog && blog._id === _id) {
                                          dispatch(getBlogDetailSuccess({
                                            data: {
                                              ...blog,
                                              comments: comments
                                            }
                                          }));
                                        }
                                      } else {
                                        navigate("/login");
                                      }
                                    }}
                                    className="flex items-center space-x-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                    aria-label="Like comment"
                                  >
                                    {(() => {
                                      const likes = comment?.likes || [];
                                      const isLiked = Array.isArray(likes) && likes.some(like => {
                                        const likeId = typeof like === 'object' ? like._id : like;
                                        return String(likeId) === String(currentUser?._id);
                                      });
                                      return isLiked ? (
                                        <HiThumbUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                                      ) : (
                                        <HiOutlineThumbUp className="w-4 h-4" />
                                      );
                                    })()}
                                    <span>{(comment?.likes || []).length}</span>
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (currentUser) {
                                        const comments = await postCommentDislike(comment._id, _id);
                                        // Update Redux store with refreshed comments
                                        if (comments && blog && blog._id === _id) {
                                          dispatch(getBlogDetailSuccess({
                                            data: {
                                              ...blog,
                                              comments: comments
                                            }
                                          }));
                                        }
                                      } else {
                                        navigate("/login");
                                      }
                                    }}
                                    className="flex items-center space-x-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                    aria-label="Dislike comment"
                                  >
                                    {(() => {
                                      const dislikes = comment?.dislikes || [];
                                      const isDisliked = Array.isArray(dislikes) && dislikes.some(dislike => {
                                        const dislikeId = typeof dislike === 'object' ? dislike._id : dislike;
                                        return String(dislikeId) === String(currentUser?._id);
                                      });
                                      return isDisliked ? (
                                        <HiThumbDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                                      ) : (
                                        <HiOutlineThumbDown className="w-4 h-4" />
                                      );
                                    })()}
                                    <span>{(comment?.dislikes || []).length}</span>
                                  </button>
                                </div>
                                {currentUser && (
                                  <button
                                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                    className="flex items-center space-x-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                  >
                                    <HiChatAlt className="w-4 h-4" />
                                    <span>Reply</span>
                                  </button>
                                )}
                                {hasReplies && (
                                  <button
                                    onClick={() => {
                                      const newExpanded = new Set(expandedReplies);
                                      if (newExpanded.has(comment._id)) {
                                        newExpanded.delete(comment._id);
                                      } else {
                                        newExpanded.add(comment._id);
                                      }
                                      setExpandedReplies(newExpanded);
                                    }}
                                    className="flex items-center space-x-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    aria-label={expandedReplies.has(comment._id) ? "Hide replies" : "Show replies"}
                                  >
                                    {expandedReplies.has(comment._id) ? (
                                      <HiChevronUp className="w-4 h-4" />
                                    ) : (
                                      <HiChevronDown className="w-4 h-4" />
                                    )}
                                    <span>
                                      {expandedReplies.has(comment._id) ? "Hide" : "Show"} {commentReplies.length} {commentReplies.length === 1 ? "reply" : "replies"}
                                    </span>
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Reply Form - Show before replies */}
                      {replyingTo === comment._id && currentUser && (
                        <div className="ml-[52px] mt-2 mb-4 pl-4 border-l-2 border-primary-200 dark:border-primary-800">
                          <CommentForm
                            blogId={_id}
                            userId={currentUser._id}
                            parentCommentId={comment._id}
                            onCancel={() => {
                              setReplyingTo(null);
                              // Automatically expand replies when a new reply is posted
                              const newExpanded = new Set(expandedReplies);
                              newExpanded.add(comment._id);
                              setExpandedReplies(newExpanded);
                              // Refresh only comments without calling getBlogDetail (to avoid view count increment)
                              if (_id) {
                                setTimeout(async () => {
                                  const comments = await refreshComments(_id);
                                  // Update Redux store with new comments
                                  if (blog && blog._id === _id) {
                                    dispatch(getBlogDetailSuccess({
                                      data: {
                                        ...blog,
                                        comments: comments
                                      }
                                    }));
                                  }
                                }, 500);
                              }
                            }}
                          />
                        </div>
                      )}

                      {/* Replies List - Show/hide based on expandedReplies state */}
                      {hasReplies && expandedReplies.has(comment._id) && (
                        <div className="ml-[52px] mt-3 space-y-0">
                          {/* Reply Sort Dropdown */}
                          {commentReplies.length > 1 && (
                            <div className="flex items-center justify-end mb-2 px-2">
                              <div className="flex items-center space-x-2">
                                <label className="text-xs text-gray-500 dark:text-gray-400">Sort replies:</label>
                                <select
                                  value={replySort}
                                  onChange={(e) => setReplySort(e.target.value)}
                                  className="px-2 py-1 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                >
                                  <option value="newest">Newest First</option>
                                  <option value="oldest">Oldest First</option>
                                  <option value="mostLiked">Most Liked</option>
                                  <option value="leastLiked">Least Liked</option>
                                </select>
                              </div>
                            </div>
                          )}
                          {/* Replies are already sorted based on replySort */}
                          {commentReplies.map((reply, replyIndex) => {
                            const isReplyOwner = currentUser && reply?.userId?._id === currentUser._id;
                            const isEditingReply = editingComment === reply._id;
                            
                            return (
                              <div
                                key={reply._id}
                                className={`py-3 pl-4 border-l-2 border-primary-300 dark:border-primary-700 bg-gray-50/50 dark:bg-gray-800/30 ${
                                  replyIndex !== commentReplies.length - 1
                                    ? "border-b border-gray-200 dark:border-gray-700"
                                    : ""
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  {/* Avatar - Smaller for replies */}
                                  <div className="shrink-0">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500">
                                      {reply?.userId?.image ? (
                                        <img
                                          src={reply.userId.image}
                                          alt={`${reply.userId.firstName} ${reply.userId.lastName}`}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white font-semibold text-xs">
                                          {reply?.userId?.firstName?.charAt(0)?.toUpperCase() || "U"}
                                          {reply?.userId?.lastName?.charAt(0)?.toUpperCase() || ""}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Reply Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center space-x-2">
                                        <h4 className="font-semibold text-xs text-gray-900 dark:text-gray-100">
                                          {reply?.userId?.firstName || "Unknown"} {reply?.userId?.lastName || ""}
                                        </h4>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {new Date(reply.createdAt).toLocaleString(
                                            "en-US",
                                            {
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              second: "2-digit",
                                            }
                                          )}
                                        </span>
                                      </div>
                                      {/* Edit/Delete for Reply Owner */}
                                      {isReplyOwner && !isEditingReply && (
                                        <div className="flex items-center space-x-1">
                                          <button
                                            onClick={() => setEditingComment(reply._id)}
                                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                            aria-label="Edit reply"
                                          >
                                            <HiPencil className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            onClick={() => setCommentToDelete(reply._id)}
                                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                            aria-label="Delete reply"
                                          >
                                            <HiTrash className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {isEditingReply ? (
                                      <div className="mt-2">
                                        <CommentForm
                                          blogId={_id}
                                          userId={currentUser._id}
                                          commentId={reply._id}
                                          initialText={reply.comment}
                                          isEdit={true}
                                          onCancel={(comments) => {
                                            setEditingComment(null);
                                            // Update Redux store with refreshed comments
                                            if (comments && blog && blog._id === _id) {
                                              dispatch(getBlogDetailSuccess({
                                                data: {
                                                  ...blog,
                                                  comments: comments
                                                }
                                              }));
                                            }
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <>
                                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-2">
                                          {reply.comment}
                                        </p>
                                        {/* Like/Dislike Buttons for Reply */}
                                        <div className="flex items-center space-x-2 mt-2">
                                          <button
                                            onClick={async () => {
                                              if (currentUser) {
                                                const comments = await postCommentLike(reply._id, _id);
                                                // Update Redux store with refreshed comments
                                                if (comments && blog && blog._id === _id) {
                                                  dispatch(getBlogDetailSuccess({
                                                    data: {
                                                      ...blog,
                                                      comments: comments
                                                    }
                                                  }));
                                                }
                                              } else {
                                                navigate("/login");
                                              }
                                            }}
                                            className="flex items-center space-x-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                            aria-label="Like reply"
                                          >
                                            {(() => {
                                              const likes = reply?.likes || [];
                                              const isLiked = Array.isArray(likes) && likes.some(like => {
                                                const likeId = typeof like === 'object' ? like._id : like;
                                                return String(likeId) === String(currentUser?._id);
                                              });
                                              return isLiked ? (
                                                <HiThumbUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                              ) : (
                                                <HiOutlineThumbUp className="w-3.5 h-3.5" />
                                              );
                                            })()}
                                            <span>{(reply?.likes || []).length}</span>
                                          </button>
                                          <button
                                            onClick={async () => {
                                              if (currentUser) {
                                                const comments = await postCommentDislike(reply._id, _id);
                                                // Update Redux store with refreshed comments
                                                if (comments && blog && blog._id === _id) {
                                                  dispatch(getBlogDetailSuccess({
                                                    data: {
                                                      ...blog,
                                                      comments: comments
                                                    }
                                                  }));
                                                }
                                              } else {
                                                navigate("/login");
                                              }
                                            }}
                                            className="flex items-center space-x-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                            aria-label="Dislike reply"
                                          >
                                            {(() => {
                                              const dislikes = reply?.dislikes || [];
                                              const isDisliked = Array.isArray(dislikes) && dislikes.some(dislike => {
                                                const dislikeId = typeof dislike === 'object' ? dislike._id : dislike;
                                                return String(dislikeId) === String(currentUser?._id);
                                              });
                                              return isDisliked ? (
                                                <HiThumbDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                                              ) : (
                                                <HiOutlineThumbDown className="w-3.5 h-3.5" />
                                              );
                                            })()}
                                            <span>{(reply?.dislikes || []).length}</span>
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                });
              })() : (
                <div className="text-center py-12">
                  <HiChatAlt className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {openEditModal && (
        <EditBlogModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          blog={blogData}
          initialState={{
            title: title,
            content: content,
            image: image,
            categoryId: categoryId?._id || categoryId || "",
            isPublish: blog?.isPublish ?? blogData?.isPublish ?? true,
          }}
        />
      )}

      {/* Delete Comment Confirmation Modal */}
      {commentToDelete && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setCommentToDelete(null)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl transition-all duration-300 animate-scale-in border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                      <HiTrash className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Delete Comment
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCommentToDelete(null)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Close modal"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Are you sure you want to delete this comment? This action cannot be undone and the comment will be permanently removed.
                </p>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setCommentToDelete(null)}
                  className="px-6 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteComment(commentToDelete, _id);
                    setCommentToDelete(null);
                  }}
                  className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  Delete Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
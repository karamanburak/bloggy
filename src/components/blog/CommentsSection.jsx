import { useState, useMemo, memo } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { HiChatAlt, HiX, HiTrash } from "react-icons/hi";

const CommentsSection = memo(({
  blog,
  blogId,
  currentUser,
  onDeleteComment,
  onLikeComment,
  onDislikeComment,
  onRefreshComments,
}) => {
  const [commentSort, setCommentSort] = useState("newest");
  const [replySort, setReplySort] = useState("newest");
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [commentToDelete, setCommentToDelete] = useState(null);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "mostLiked", label: "Most Liked" },
    { value: "leastLiked", label: "Least Liked" },
  ];

  const getParentId = (comment) => {
    let parentId =
      comment.parentCommentId ||
      comment.parentId ||
      comment.parentComment ||
      comment.replyTo ||
      comment.parent;

    if (typeof parentId === "string" && parentId.trim() !== "" && parentId !== "null" && parentId !== "undefined") {
      return parentId;
    }

    if (typeof parentId === "object" && parentId !== null) {
      const extractedId = parentId._id || parentId.id || null;
      if (extractedId && typeof extractedId === "string" && extractedId.trim() !== "") {
        return extractedId;
      }
    }

    if (comment.parentComment && typeof comment.parentComment === "object") {
      return comment.parentComment._id || comment.parentComment.id || null;
    }

    return null;
  };

  const compareIds = (id1, id2) => {
    if (!id1 || !id2) return false;
    return String(id1).trim() === String(id2).trim();
  };

  const { validComments, parentComments, replies } = useMemo(() => {
    if (!blog?.comments || !Array.isArray(blog.comments)) {
      return { validComments: [], parentComments: [], replies: [] };
    }

    const valid = blog.comments.filter((comment) => {
      if (!comment || typeof comment !== "object") return false;
      if (!comment._id || !comment.comment || !comment.userId) return false;
      if (typeof comment.userId !== "object" || !comment.userId._id) return false;
      return true;
    });

    const parents = valid.filter((comment) => {
      const parentId = getParentId(comment);
      return !parentId;
    });

    const replyList = valid.filter((comment) => {
      const parentId = getParentId(comment);
      return parentId && parentId !== "";
    });

    return { validComments: valid, parentComments: parents, replies: replyList };
  }, [blog?.comments]);

  const sortComments = (comments, sortType) => {
    const sorted = [...comments];
    switch (sortType) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "mostLiked":
        return sorted.sort((a, b) => {
          const aLikes = Array.isArray(a.likes) ? a.likes.length : 0;
          const bLikes = Array.isArray(b.likes) ? b.likes.length : 0;
          const aDislikes = Array.isArray(a.dislikes) ? a.dislikes.length : 0;
          const bDislikes = Array.isArray(b.dislikes) ? b.dislikes.length : 0;
          const aNet = aLikes - aDislikes;
          const bNet = bLikes - bDislikes;
          if (aNet !== bNet) return bNet - aNet;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      case "leastLiked":
        return sorted.sort((a, b) => {
          const aLikes = Array.isArray(a.likes) ? a.likes.length : 0;
          const bLikes = Array.isArray(b.likes) ? b.likes.length : 0;
          const aDislikes = Array.isArray(a.dislikes) ? a.dislikes.length : 0;
          const bDislikes = Array.isArray(b.dislikes) ? b.dislikes.length : 0;
          const aNet = aLikes - aDislikes;
          const bNet = bLikes - bDislikes;
          if (aNet !== bNet) return aNet - bNet;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      default:
        return sorted;
    }
  };

  const sortedParentComments = sortComments(parentComments, commentSort);
  const sortedReplies = sortComments(replies, replySort);

  const handleToggleReplies = (commentId) => {
    setExpandedReplies((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(commentId)) {
        newExpanded.delete(commentId);
      } else {
        newExpanded.add(commentId);
      }
      return newExpanded;
    });
  };

  const handleDelete = (commentId) => {
    setCommentToDelete(commentId);
  };

  const confirmDelete = () => {
    if (commentToDelete) {
      onDeleteComment(commentToDelete, blogId);
      setCommentToDelete(null);
    }
  };

  const parentCommentsCount = parentComments.length;

  return (
    <div id="comments-section" className="mt-16 pt-12 border-t border-gray-200/50">
      {currentUser && (
        <div className="mb-12">
          <CommentForm 
            blogId={blogId} 
            userId={currentUser._id}
            onCancel={async () => {
              if (onRefreshComments && blogId) {
                const comments = await onRefreshComments(blogId);
                if (blog && blog._id === blogId) {
                  setTimeout(() => {
                    onRefreshComments(blogId);
                  }, 100);
                }
              }
            }}
          />
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
            <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {parentCommentsCount} {parentCommentsCount === 1 ? "comment" : "comments"}
            </p>
          </div>
        </div>
        {/* Sort Dropdown - Only show if there are comments */}
        {parentCommentsCount > 0 && (
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Sort:</label>
            <select
              value={commentSort}
              onChange={(e) => setCommentSort(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-0">
        {sortedParentComments.length > 0 ? (
          sortedParentComments.map((comment) => {
            const commentReplies = sortedReplies.filter((reply) => {
              const replyParentId = getParentId(reply);
              const commentId = String(comment._id);
              if (!replyParentId) return false;
              return String(replyParentId).trim() === String(commentId).trim();
            });

            return (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUser={currentUser}
                blogId={blogId}
                blog={blog}
                replies={commentReplies}
                expandedReplies={expandedReplies}
                replySort={replySort}
                onToggleReplies={handleToggleReplies}
                onDelete={handleDelete}
                onLike={onLikeComment}
                onDislike={onDislikeComment}
                onRefreshComments={onRefreshComments}
              />
            );
          })
        ) : (
          <div className="text-center py-12">
            <HiChatAlt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">
              No comments yet. Be the first to comment!
            </p>
          </div>
        )}
      </div>

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
              className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 animate-scale-in border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                      <HiTrash className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Delete Comment
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCommentToDelete(null)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Close modal"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <p className="text-gray-700 leading-relaxed">
                  Are you sure you want to delete this comment? This action cannot be undone and the
                  comment will be permanently removed.
                </p>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setCommentToDelete(null)}
                  className="px-6 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
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
}, (prevProps, nextProps) => {
  return (
    prevProps.blogId === nextProps.blogId &&
    prevProps.blog?._id === nextProps.blog?._id &&
    prevProps.blog?.comments === nextProps.blog?.comments &&
    prevProps.currentUser?._id === nextProps.currentUser?._id
  );
});

CommentsSection.displayName = "CommentsSection";

export default CommentsSection;


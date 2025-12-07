import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { formatDateTime } from "../../helper/formatDate";
import CommentForm from "./CommentForm";
import {
  HiPencil,
  HiTrash,
  HiChevronDown,
  HiChevronUp,
  HiThumbUp,
  HiThumbDown,
  HiOutlineThumbUp,
  HiOutlineThumbDown,
} from "react-icons/hi";
import { getBlogDetailSuccess } from "../../features/blogSlice";

const CommentItem = ({
  comment,
  currentUser,
  blogId,
  blog,
  replies = [],
  expandedReplies,
  replySort,
  onToggleReplies,
  onDelete,
  onLike,
  onDislike,
  onRefreshComments,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [editingComment, setEditingComment] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  const isCommentOwner = currentUser && comment?.userId?._id === currentUser._id;
  const isEditing = editingComment === comment._id;
  const hasReplies = replies.length > 0;
  const isExpanded = expandedReplies.has(comment._id);

  const handleLike = async () => {
    if (currentUser) {
      const comments = await onLike(comment._id, blogId);
      if (comments && blog && blog._id === blogId) {
        dispatch(
          getBlogDetailSuccess({
            data: {
              ...blog,
              comments: comments,
            },
          })
        );
      }
    } else {
      navigate("/login");
    }
  };

  const handleDislike = async () => {
    if (currentUser) {
      const comments = await onDislike(comment._id, blogId);
      if (comments && blog && blog._id === blogId) {
        dispatch(
          getBlogDetailSuccess({
            data: {
              ...blog,
              comments: comments,
            },
          })
        );
      }
    } else {
      navigate("/login");
    }
  };

  const isLiked = () => {
    const likes = comment?.likes || [];
    return Array.isArray(likes) && likes.some((like) => {
      const likeId = typeof like === "object" ? like._id : like;
      return String(likeId) === String(currentUser?._id);
    });
  };

  const isDisliked = () => {
    const dislikes = comment?.dislikes || [];
    return Array.isArray(dislikes) && dislikes.some((dislike) => {
      const dislikeId = typeof dislike === "object" ? dislike._id : dislike;
      return String(dislikeId) === String(currentUser?._id);
    });
  };

  const reactionButtons = [
    {
      id: "like",
      onClick: handleLike,
      isActive: isLiked(),
      activeIcon: HiThumbUp,
      inactiveIcon: HiOutlineThumbUp,
      count: (comment?.likes || []).length,
      activeColor: "text-green-600 dark:text-green-400",
      inactiveColor: "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400",
      ariaLabel: "Like comment",
    },
    {
      id: "dislike",
      onClick: handleDislike,
      isActive: isDisliked(),
      activeIcon: HiThumbDown,
      inactiveIcon: HiOutlineThumbDown,
      count: (comment?.dislikes || []).length,
      activeColor: "text-red-600 dark:text-red-400",
      inactiveColor: "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400",
      ariaLabel: "Dislike comment",
    },
  ];

  return (
    <div>
      <div className="flex items-start space-x-3 animate-fade-in py-3">
        {/* Avatar */}
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

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {comment?.userId?.firstName || "Unknown"} {comment?.userId?.lastName || ""}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDateTime(comment.createdAt)}
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
                  onClick={() => onDelete(comment._id)}
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
                blogId={blogId}
                userId={currentUser._id}
                commentId={comment._id}
                initialText={comment.comment}
                isEdit={true}
                onCancel={(comments) => {
                  setEditingComment(null);
                  if (comments && blog && blog._id === blogId) {
                    dispatch(
                      getBlogDetailSuccess({
                        data: {
                          ...blog,
                          comments: comments,
                        },
                      })
                    );
                  }
                }}
              />
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap mb-1">
                {comment.comment}
              </p>
              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mt-1.5">
                {/* Like/Dislike Buttons */}
                <div className="flex items-center space-x-1">
                  {reactionButtons.map((reaction) => {
                    const ActiveIcon = reaction.activeIcon;
                    const InactiveIcon = reaction.inactiveIcon;
                    return (
                      <button
                        key={reaction.id}
                        onClick={reaction.onClick}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium transition-colors ${
                          reaction.isActive ? reaction.activeColor : reaction.inactiveColor
                        }`}
                        aria-label={reaction.ariaLabel}
                      >
                        {reaction.isActive ? (
                          <ActiveIcon className={`w-4 h-4 ${reaction.activeColor}`} />
                        ) : (
                          <InactiveIcon className="w-4 h-4" />
                        )}
                        <span>{reaction.count}</span>
                      </button>
                    );
                  })}
                </div>
                {currentUser && (
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                    className="px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    Reply
                  </button>
                )}
                {hasReplies && (
                  <button
                    onClick={() => onToggleReplies(comment._id)}
                    className="px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    aria-label={isExpanded ? "Hide replies" : "Show replies"}
                  >
                    {isExpanded ? (
                      <>
                        <HiChevronUp className="w-4 h-4 inline mr-1" />
                        Hide {replies.length} {replies.length === 1 ? "reply" : "replies"}
                      </>
                    ) : (
                      <>
                        <HiChevronDown className="w-4 h-4 inline mr-1" />
                        View {replies.length} {replies.length === 1 ? "reply" : "replies"}
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {replyingTo === comment._id && currentUser && (
        <div className="ml-12 mt-1 mb-2 animate-slide-down">
          <CommentForm
            blogId={blogId}
            userId={currentUser._id}
            parentCommentId={comment._id}
            onCancel={() => {
              setReplyingTo(null);
              const newExpanded = new Set(expandedReplies);
              newExpanded.add(comment._id);
              onToggleReplies(comment._id);
              if (blogId) {
                setTimeout(async () => {
                  const comments = await onRefreshComments(blogId);
                  if (blog && blog._id === blogId) {
                    dispatch(
                      getBlogDetailSuccess({
                        data: {
                          ...blog,
                          comments: comments,
                        },
                      })
                    );
                  }
                }, 500);
              }
            }}
          />
        </div>
      )}

      {/* Replies */}
      {hasReplies && isExpanded && (
        <div
          className={`ml-12 mt-1 space-y-0 overflow-hidden transition-all duration-700 ease-in-out ${
            isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {replies.map((reply) => (
            <ReplyItem
              key={reply._id}
              reply={reply}
              currentUser={currentUser}
              blogId={blogId}
              blog={blog}
              onDelete={onDelete}
              onLike={onLike}
              onDislike={onDislike}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ReplyItem = ({ reply, currentUser, blogId, blog, onDelete, onLike, onDislike }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [editingReply, setEditingReply] = useState(null);

  const isReplyOwner = currentUser && reply?.userId?._id === currentUser._id;
  const isEditing = editingReply === reply._id;

  const handleLike = async () => {
    if (currentUser) {
      const comments = await onLike(reply._id, blogId);
      if (comments && blog && blog._id === blogId) {
        dispatch(
          getBlogDetailSuccess({
            data: {
              ...blog,
              comments: comments,
            },
          })
        );
      }
    } else {
      navigate("/login");
    }
  };

  const handleDislike = async () => {
    if (currentUser) {
      const comments = await onDislike(reply._id, blogId);
      if (comments && blog && blog._id === blogId) {
        dispatch(
          getBlogDetailSuccess({
            data: {
              ...blog,
              comments: comments,
            },
          })
        );
      }
    } else {
      navigate("/login");
    }
  };

  const isLiked = () => {
    const likes = reply?.likes || [];
    return Array.isArray(likes) && likes.some((like) => {
      const likeId = typeof like === "object" ? like._id : like;
      return String(likeId) === String(currentUser?._id);
    });
  };

  const isDisliked = () => {
    const dislikes = reply?.dislikes || [];
    return Array.isArray(dislikes) && dislikes.some((dislike) => {
      const dislikeId = typeof dislike === "object" ? dislike._id : dislike;
      return String(dislikeId) === String(currentUser?._id);
    });
  };

  const replyReactionButtons = [
    {
      id: "like",
      onClick: handleLike,
      isActive: isLiked(),
      activeIcon: HiThumbUp,
      inactiveIcon: HiOutlineThumbUp,
      count: (reply?.likes || []).length,
      activeColor: "text-green-600 dark:text-green-400",
      inactiveColor: "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400",
      ariaLabel: "Like reply",
    },
    {
      id: "dislike",
      onClick: handleDislike,
      isActive: isDisliked(),
      activeIcon: HiThumbDown,
      inactiveIcon: HiOutlineThumbDown,
      count: (reply?.dislikes || []).length,
      activeColor: "text-red-600 dark:text-red-400",
      inactiveColor: "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400",
      ariaLabel: "Dislike reply",
    },
  ];

  return (
    <div className="flex items-start space-x-3 py-1.5">
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
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-xs text-gray-900 dark:text-gray-100">
              {reply?.userId?.firstName || "Unknown"} {reply?.userId?.lastName || ""}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDateTime(reply.createdAt)}
            </span>
          </div>
          {/* Edit/Delete for Reply Owner */}
          {isReplyOwner && !isEditing && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setEditingReply(reply._id)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Edit reply"
              >
                <HiPencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(reply._id)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                aria-label="Delete reply"
              >
                <HiTrash className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2">
            <CommentForm
              blogId={blogId}
              userId={currentUser._id}
              commentId={reply._id}
              initialText={reply.comment}
              isEdit={true}
              onCancel={(comments) => {
                setEditingReply(null);
                if (comments && blog && blog._id === blogId) {
                  dispatch(
                    getBlogDetailSuccess({
                      data: {
                        ...blog,
                        comments: comments,
                      },
                    })
                  );
                }
              }}
            />
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-1.5">
              {reply.comment}
            </p>
            {/* Like/Dislike Buttons for Reply */}
            <div className="flex items-center space-x-3 mt-1">
              {replyReactionButtons.map((reaction) => {
                const ActiveIcon = reaction.activeIcon;
                const InactiveIcon = reaction.inactiveIcon;
                return (
                  <button
                    key={reaction.id}
                    onClick={reaction.onClick}
                    className={`flex items-center space-x-1 text-xs font-medium transition-colors ${
                      reaction.isActive ? reaction.activeColor : reaction.inactiveColor
                    }`}
                    aria-label={reaction.ariaLabel}
                  >
                    {reaction.isActive ? (
                      <ActiveIcon className={`w-4 h-4 ${reaction.activeColor}`} />
                    ) : (
                      <InactiveIcon className="w-4 h-4" />
                    )}
                    <span>{reaction.count}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentItem;


import { useState } from "react";
import { useSelector } from "react-redux";
import useBlogCall from "../../hooks/useBlogCall";
import { 
  HiExclamationCircle
} from "react-icons/hi";
import avatar from "../../assets/avatar.png";

const CommentForm = ({ blogId, userId, parentCommentId = null, onCancel, initialText = "", isEdit = false, commentId = null }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const { postComment, updateComment } = useBlogCall();
  const [commentText, setCommentText] = useState(initialText);
  const [isFocused, setIsFocused] = useState(!!initialText);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    if (commentText.trim().length < 3) {
      setError("Comment must be at least 3 characters");
      return;
    }

    if (commentText.trim().length > 1000) {
      setError("Comment cannot exceed 1000 characters");
      return;
    }

    setError("");
    
    if (isEdit && commentId) {
      const comments = await updateComment(commentId, blogId, commentText.trim());
      setCommentText("");
      setIsFocused(false);
      setError("");
      if (onCancel) onCancel(comments);
    } else {
      const commentData = {
        blogId: blogId,
        userId: userId,
        comment: commentText.trim(),
      };
      
      if (parentCommentId) {
        commentData.parentCommentId = parentCommentId;
      }
      
      try {
        await postComment("comments", commentData);
        setCommentText("");
        setIsFocused(false);
        setError("");
        if (onCancel) onCancel();
      } catch (error) {
        // Error is already handled in postComment
      }
    }
  };

  const handleCancel = () => {
    setCommentText("");
    setIsFocused(false);
    setError("");
    if (onCancel) onCancel();
  };

  const handleChange = (e) => {
    setCommentText(e.target.value);
    if (error) setError("");
  };

  if (!userId || !currentUser) {
    return null;
  }

  const userAvatar = currentUser?.image || avatar;
  const showButtons = isFocused || commentText.length > 0;

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={currentUser?.username || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
                  {currentUser?.firstName?.charAt(0).toUpperCase() || "U"}
                  {currentUser?.lastName?.charAt(0).toUpperCase() || ""}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className={`relative rounded-2xl border transition-all duration-200 ${
                isFocused || commentText
                  ? "border-primary-500 dark:border-primary-400 bg-white dark:bg-gray-800"
                  : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50"
              }`}>
                <textarea
                  id="comment"
                  name="comment"
                  rows={isFocused || commentText ? 4 : 1}
                  value={commentText}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    if (!commentText) {
                      setIsFocused(false);
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-2xl resize-none transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none ${
                    error
                      ? "border-red-500 dark:border-red-400"
                      : ""
                  }`}
                  placeholder={isEdit ? "Edit your comment..." : parentCommentId ? "Add a reply..." : "Add a public comment..."}
                  aria-invalid={!!error}
                  aria-describedby={error ? "comment-error" : undefined}
                  maxLength={1000}
                />
              </div>
              
              {error && (
                <p
                  id="comment-error"
                  className="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  <HiExclamationCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </p>
              )}
            </div>

            {showButtons && (
              <div className="flex items-center justify-end space-x-3 mt-3 animate-slide-down">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-600"
                  disabled={!commentText.trim() || commentText.trim().length < 3}
                >
                  {isEdit ? "Update" : parentCommentId ? "Reply" : "Comment"}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
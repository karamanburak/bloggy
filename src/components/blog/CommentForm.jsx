import { useState } from "react";
import useBlogCall from "../../hooks/useBlogCall";
import { HiChatAlt } from "react-icons/hi";

const CommentForm = ({ blogId, userId }) => {
  const { postComment } = useBlogCall();
  const [commentText, setCommentText] = useState("");
  const [showCommentField, setShowCommentField] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const commentData = {
      blogId: blogId,
      userId: userId,
      comment: commentText,
    };
    postComment("comments", commentData);
    setCommentText("");
    setShowCommentField(false);
  };

  const handleCancel = () => {
    setCommentText("");
    setShowCommentField(false);
  };

  if (!userId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          Please log in to leave a comment
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6 mb-8">
      {!showCommentField ? (
        <button
          onClick={() => setShowCommentField(true)}
          className="w-full text-left p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <div className="flex items-center space-x-3">
            <HiChatAlt className="w-5 h-5" />
            <span>Write your comment here...</span>
          </div>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Your Comment
            </label>
            <textarea
              id="comment"
              rows={6}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="input-field resize-none"
              placeholder="Share your thoughts..."
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!commentText.trim()}
            >
              Post Comment
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CommentForm;
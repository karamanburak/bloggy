import { useState, useEffect } from "react";
import useAdminCall from "../../hooks/useAdminCall";
import { HiUser, HiDocumentText, HiClock, HiEye, HiChat } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";
import { toastSuccessNotify } from "../../helper/ToastNotify";

const UserActivity = () => {
  const { getAllUsers, getUserBlogs, getAllBlogs, deleteBlog, getUserComments, getAllComments, deleteComment } = useAdminCall();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityView, setActivityView] = useState("all"); // 'all', 'user', 'comments'
  const [contentType, setContentType] = useState("blogs"); // 'blogs' or 'comments'

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedUser && activityView === "user") {
      if (contentType === "blogs") {
        loadUserBlogs(selectedUser);
      } else {
        loadUserComments(selectedUser);
      }
    }
  }, [selectedUser, activityView, contentType]);

  const loadData = async () => {
    setLoading(true);
    const usersResult = await getAllUsers();
    const blogsResult = await getAllBlogs();
    const commentsResult = await getAllComments();

    if (usersResult.success) {
      setUsers(Array.isArray(usersResult.data) ? usersResult.data : []);
    }
    if (blogsResult.success) {
      setAllBlogs(Array.isArray(blogsResult.data) ? blogsResult.data : []);
    }
    if (commentsResult.success) {
      setAllComments(Array.isArray(commentsResult.data) ? commentsResult.data : []);
    }
    setLoading(false);
  };

  const loadUserBlogs = async (userId) => {
    const result = await getUserBlogs(userId);
    if (result.success) {
      setUserBlogs(Array.isArray(result.data) ? result.data : []);
    }
  };

  const loadUserComments = async (userId) => {
    const result = await getUserComments(userId);
    if (result.success) {
      setUserComments(Array.isArray(result.data) ? result.data : []);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      const result = await deleteBlog(blogId);
      if (result.success) {
        toastSuccessNotify("Blog deleted successfully");
        loadData();
        if (selectedUser) {
          loadUserBlogs(selectedUser);
        }
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      const result = await deleteComment(commentId);
      if (result.success) {
        toastSuccessNotify("Comment deleted successfully");
        loadData();
        if (selectedUser && contentType === "comments") {
          loadUserComments(selectedUser);
        }
      }
    }
  };

  const getBlogsByUser = (userId) => {
    return allBlogs.filter((blog) => blog.author?._id === userId || blog.author === userId);
  };

  const getCommentsByUser = (userId) => {
    return allComments.filter((comment) => comment.user?._id === userId || comment.user === userId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const displayBlogs = activityView === "all" ? allBlogs : userBlogs;
  const displayComments = activityView === "all" ? allComments : userComments;

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              setActivityView("all");
              setSelectedUser(null);
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activityView === "all"
                ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            All Activities
          </button>
          <button
            onClick={() => setActivityView("user")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activityView === "user"
                ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            User Activities
          </button>
        </div>
        {activityView === "user" && (
          <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setContentType("blogs");
                if (selectedUser) {
                  loadUserBlogs(selectedUser);
                }
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                contentType === "blogs"
                  ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <HiDocumentText className="w-5 h-5 inline mr-2" />
              Blogs
            </button>
            <button
              onClick={() => {
                setContentType("comments");
                if (selectedUser) {
                  loadUserComments(selectedUser);
                }
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                contentType === "comments"
                  ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <HiChat className="w-5 h-5 inline mr-2" />
              Comments
            </button>
          </div>
        )}
      </div>

      {/* User Selector (for user view) */}
      {activityView === "user" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Select User
          </label>
          <select
            value={selectedUser || ""}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select a user...</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.firstName} {user.lastName} (@{user.username})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold mt-2">{users.length}</p>
            </div>
            <HiUser className="w-12 h-12 text-primary-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100 text-sm font-medium">Total Blogs</p>
              <p className="text-3xl font-bold mt-2">{allBlogs.length}</p>
            </div>
            <HiDocumentText className="w-12 h-12 text-accent-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                {activityView === "all"
                  ? "Total Comments"
                  : selectedUser
                  ? contentType === "blogs"
                    ? "Selected User Blogs"
                    : "Selected User Comments"
                  : "Active Blogs"}
              </p>
              <p className="text-3xl font-bold mt-2">
                {activityView === "all"
                  ? allComments.length
                  : selectedUser
                  ? contentType === "blogs"
                    ? getBlogsByUser(selectedUser).length
                    : getCommentsByUser(selectedUser).length
                  : allBlogs.length}
              </p>
            </div>
            {activityView === "all" || contentType === "comments" ? (
              <HiChat className="w-12 h-12 text-purple-200" />
            ) : (
              <HiEye className="w-12 h-12 text-purple-200" />
            )}
          </div>
        </div>
      </div>

      {/* Blogs/Comments List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
          <h3 className="text-lg font-bold flex items-center space-x-2">
            {contentType === "comments" ? (
              <HiChat className="w-5 h-5" />
            ) : (
              <HiDocumentText className="w-5 h-5" />
            )}
            <span>
              {activityView === "all"
                ? contentType === "comments"
                  ? "All Comments"
                  : "All Blogs"
                : selectedUser
                ? `${users.find((u) => u._id === selectedUser)?.firstName || ""} ${
                    users.find((u) => u._id === selectedUser)?.lastName || ""
                  } - ${contentType === "comments" ? "Comments" : "Blogs"}`
                : "Select User"}
            </span>
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {contentType === "comments" ? (
            displayComments.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                {activityView === "user" && !selectedUser
                  ? "Please select a user"
                  : "No comments found"}
              </div>
            ) : (
              displayComments.map((comment) => {
                const commentUser = users.find(
                  (u) => u._id === comment.user?._id || u._id === comment.user
                );
                const blog = allBlogs.find(
                  (b) => b._id === comment.blogId || b._id === comment.blog?._id
                );
                return (
                  <div
                    key={comment._id}
                    className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {commentUser && (
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {commentUser.firstName} {commentUser.lastName}
                            </span>
                          )}
                          {blog && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              on "{blog.title}"
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                          {comment.comment}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <HiClock className="w-4 h-4" />
                            <span>
                              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Delete Comment"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            displayBlogs.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                {activityView === "user" && !selectedUser
                  ? "Please select a user"
                  : "No blogs found"}
              </div>
            ) : (
              displayBlogs.map((blog) => {
                const author = users.find(
                  (u) => u._id === blog.author?._id || u._id === blog.author
                );
                return (
                  <div
                    key={blog._id}
                    className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {blog.title}
                          </h4>
                          {author && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              by {author.firstName} {author.lastName}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                          {blog.content?.replace(/<[^>]*>/g, "").substring(0, 150)}...
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <HiClock className="w-4 h-4" />
                            <span>
                              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          {blog.readCount !== undefined && (
                            <div className="flex items-center space-x-1">
                              <HiEye className="w-4 h-4" />
                              <span>{blog.readCount} views</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Delete Blog"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActivity;


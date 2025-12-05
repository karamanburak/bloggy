import { useDispatch } from "react-redux";
import {
  fetchFail,
  fetchStart,
  getSuccess,
  getBlogDetailSuccess,
  getCommentSuccess,
} from "../features/blogSlice";
import useAxios from "./useAxios";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";
import store from "../app/store";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const useBlogCall = () => {
  const dispatch = useDispatch();
  const axiosWithToken = useAxios();

  const getBlogData = async (url) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken(`${url}`);
      //   console.log(data.data);
      dispatch(getSuccess({ data: data.data, url }));
    } catch (error) {
      dispatch(fetchFail());
    }
  };

  const getUserBlogs = async (userId) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken(`blogs?author=${userId}`);
      dispatch(getSuccess({ data: data.data, url: "blogs" }));
      //   console.log(data);
    } catch (error) {
      dispatch(fetchFail());
    }
  };

  const getCommentsByBlogId = async (blogId) => {
    try {
      // API endpoint: comments?blogId=...
      // API returns nested structure: [{ ...comment, replies: [reply1, reply2] }]
      // We need to flatten it to: [comment1, comment2, reply1, reply2]
      try {
        const { data } = await axiosWithToken(`comments?blogId=${blogId}`);
        const comments = data?.data || [];
        
        if (Array.isArray(comments) && comments.length > 0) {
          // Check if comments have nested replies structure (API format)
          const hasNestedReplies = comments[0]?.replies && Array.isArray(comments[0].replies);
          
          if (hasNestedReplies) {
            // Flatten comments and replies into a single array
            const flattenedComments = [];
            
            comments.forEach(comment => {
              // Add parent comment (without replies property)
              const { replies, ...parentComment } = comment;
              flattenedComments.push(parentComment);
              
              // Add replies if they exist
              if (replies && Array.isArray(replies) && replies.length > 0) {
                replies.forEach(reply => {
                  // Ensure parentCommentId is a string (not an object)
                  const flattenedReply = {
                    ...reply.toObject ? reply.toObject() : reply,
                    parentCommentId: comment._id.toString() // Ensure it's a string
                  };
                  flattenedComments.push(flattenedReply);
                });
              }
            });
            
            
            return flattenedComments;
          } else {
            // Already flat structure, return as is
            return comments;
          }
        }
      } catch (err) {
        // Error fetching comments
      }
      
      return [];
    } catch (error) {
      return [];
    }
  };

  const getBlogDetail = async (url, id) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken(`${url}/${id}`);
      
      // Backend's getBlogDetail returns flat comments array without nested replies
      // We need to fetch comments separately using comment.list endpoint to get nested structure
      // This endpoint returns: [{ ...comment, replies: [reply1, reply2] }]
      const populatedComments = await getCommentsByBlogId(id);
      
      // Replace blog's comments with populated comments (including nested replies)
      if (populatedComments.length > 0) {
        data.data.comments = populatedComments;
      } else {
        // If no comments found, set to empty array
        data.data.comments = [];
      }
      
      // Ensure we're passing the correct format to the reducer
      dispatch(getBlogDetailSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchFail());
      throw error;
    }
  };

  const deleteBlog = async (url, id) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.delete(`${url}/${id}`);
      toastSuccessNotify("Blog successfully deleted");
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation not success"
      );
    } finally {
      getBlogData(url);
    }
  };

  const postBlog = async (url, info) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(url, info);
      toastSuccessNotify("Blog successfully added!");
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation not success"
      );
    } finally {
      getBlogData(url);
    }
  };

  const putBlog = async (url, id, info) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.put(`${url}/${id}`, info);
      toastSuccessNotify("Blog successfully changed");
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation not success"
      );
    } finally {
      getBlogDetail(url, id);
    }
  };

  const getComments = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken("comments");
      dispatch(getCommentSuccess(data));
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation not success"
      );
    }
  };
  const postComment = async (url, info) => {
    dispatch(fetchStart());
    try {
      const response = await axiosWithToken.post(`${url}`, info);
      
      // Small delay to ensure backend has processed the comment
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Refresh only comments without calling getBlogDetail (to avoid view count increment)
      // The caller should update Redux store with refreshed comments
      const comments = await getCommentsByBlogId(info.blogId);
      
      toastSuccessNotify("Comment successfully added!");
      return { ...response, comments }; // Return comments so caller can update store
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation not success"
      );
      throw error;
    }
  };

  const deleteComment = async (commentId, blogId) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.delete(`comments/${commentId}`);
      toastSuccessNotify("Comment successfully deleted!");
      getBlogDetail("blogs", blogId);
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation not success"
      );
    }
  };

  const updateComment = async (commentId, blogId, commentText) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.put(`comments/${commentId}`, { comment: commentText });
      toastSuccessNotify("Comment successfully updated!");
      // Refresh only comments without calling getBlogDetail (to avoid view count increment)
      const comments = await getCommentsByBlogId(blogId);
      return comments; // Return comments so caller can update store
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation not success"
      );
      throw error;
    }
  };

  const postLike = async (url, id) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(`${url}/${id}/postLike`);
      getBlogData("blogs");
    } catch (error) {
      dispatch(fetchFail());
    }
  };

  const getTrendsData = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken("blogs/?page=1&limit=100");
      // console.log(data);
      dispatch(getSuccess({ data: data?.data, url: "trendings" }));
    } catch (error) {
      dispatch(fetchFail());
    }
  };

  const postCommentLike = async (commentId, blogId) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(`comments/${commentId}/postLike`);
      // Refresh only comments without calling getBlogDetail (to avoid view count increment)
      const comments = await getCommentsByBlogId(blogId);
      return comments; // Return comments so caller can update store
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation not success"
      );
    }
  };

  const postCommentDislike = async (commentId, blogId) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(`comments/${commentId}/postDislike`);
      // Refresh only comments without calling getBlogDetail (to avoid view count increment)
      const comments = await getCommentsByBlogId(blogId);
      return comments; // Return comments so caller can update store
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation not success"
      );
    }
  };

  const postView = async (url, id) => {
    try {
      await axiosWithToken.post(`${url}/${id}/postView`);
      // Refresh blog list to update view counts in dashboard and other pages
      // Don't call getBlogDetail here as it's already called in Detail.jsx
      // and might cause duplicate increments
      getBlogData("blogs");
    } catch (error) {
      // Silently fail - view count increment is not critical
      // Don't show error to user as it's a background operation
    }
  };

  // Refresh only comments without calling getBlogDetail (to avoid view count increment)
  // This function returns comments, the caller should update Redux store
  const refreshComments = async (blogId) => {
    try {
      const comments = await getCommentsByBlogId(blogId);
      return comments;
    } catch (error) {
      console.error("Error refreshing comments:", error);
      return [];
    }
  };

  return {
    getBlogData,
    deleteBlog,
    putBlog,
    postBlog,
    getBlogDetail,
    getUserBlogs,
    postLike,
    getComments,
    postComment,
    deleteComment,
    updateComment,
    getTrendsData,
    postCommentLike,
    postCommentDislike,
    postView,
    refreshComments,
  };
};

export default useBlogCall;

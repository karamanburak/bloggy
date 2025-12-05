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
                  flattenedComments.push(reply);
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
      
      // API returns comments with nested replies structure:
      // comments: [{ ...comment, replies: [reply1, reply2] }]
      // We need to flatten this to a single array: [comment1, comment2, reply1, reply2]
      const comments = data?.data?.comments || [];
      
      if (comments.length > 0) {
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
                flattenedComments.push(reply);
              });
            }
          });
          
          
          // Replace nested structure with flattened array
          data.data.comments = flattenedComments;
        } else {
          // Check if comments are just IDs (strings) instead of populated objects
          const hasUnpopulatedComments = comments.length > 0 && 
            (typeof comments[0] === 'string' || 
             (typeof comments[0] === 'object' && comments[0]._id && !comments[0].userId));
          
          // If comments are not populated, fetch them separately
          if (hasUnpopulatedComments) {
            const populatedComments = await getCommentsByBlogId(id);
            if (populatedComments.length > 0) {
              // Merge populated comments into blog data
              data.data.comments = populatedComments;
            } else {
              // Set to empty array if we couldn't fetch populated comments
              data.data.comments = [];
            }
          }
        }
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
      
      // Wait for blog detail to be fetched and state updated
      // This ensures the new comment/reply appears in the UI
      await getBlogDetail("blogs", info.blogId);
      
      toastSuccessNotify("Comment successfully added!");
      return response;
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
      await getBlogDetail("blogs", blogId);
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
      // Refresh blog detail to get updated like counts
      await getBlogDetail("blogs", blogId);
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
      // Refresh blog detail to get updated dislike counts
      await getBlogDetail("blogs", blogId);
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
  };
};

export default useBlogCall;

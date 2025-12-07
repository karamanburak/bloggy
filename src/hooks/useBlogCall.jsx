import { useDispatch } from "react-redux";
import {
  fetchFail,
  fetchStart,
  getSuccess,
  getBlogDetailSuccess,
  getCommentSuccess,
  incrementBlogViewer,
} from "../features/blogSlice";
import useAxios from "./useAxios";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";
import store from "../app/store";

const useBlogCall = () => {
  const dispatch = useDispatch();
  const axiosWithToken = useAxios();

  const getBlogData = async (url) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken(`${url}`);
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
    } catch (error) {
      dispatch(fetchFail());
    }
  };

  const getCommentsByBlogId = async (blogId) => {
    try {
      try {
        const { data } = await axiosWithToken(`comments?blogId=${blogId}`);
        const comments = data?.data || [];
        
        if (Array.isArray(comments) && comments.length > 0) {
          const hasNestedReplies = comments[0]?.replies && Array.isArray(comments[0].replies);
          
          if (hasNestedReplies) {
            const flattenedComments = [];
            
            comments.forEach(comment => {
              const { replies, ...parentComment } = comment;
              flattenedComments.push(parentComment);
              
              if (replies && Array.isArray(replies) && replies.length > 0) {
                replies.forEach(reply => {
                  const flattenedReply = {
                    ...reply.toObject ? reply.toObject() : reply,
                    parentCommentId: comment._id.toString()
                  };
                  flattenedComments.push(flattenedReply);
                });
              }
            });
            
            return flattenedComments;
          } else {
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

  const getBlogDetail = async (url, id, skipComments = false) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken(`${url}/${id}`);
      
      if (!skipComments) {
        const populatedComments = await getCommentsByBlogId(id);
        
        if (populatedComments.length > 0) {
          data.data.comments = populatedComments;
        } else {
          data.data.comments = [];
        }
      } else if (!data.data.comments) {
        data.data.comments = [];
      }
      
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
      toastSuccessNotify("Blog deleted successfully");
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation failed. Please try again."
      );
    } finally {
      getBlogData(url);
    }
  };

  const postBlog = async (url, info) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(url, info);
      toastSuccessNotify("Blog published successfully! 🎉");
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation failed. Please try again."
      );
    } finally {
      getBlogData(url);
    }
  };

  const putBlog = async (url, id, info) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.put(`${url}/${id}`, info);
      toastSuccessNotify("Blog updated successfully! Your changes have been saved.");
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation failed. Please try again."
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
        error?.response?.data?.message || "Operation failed. Please try again."
      );
    }
  };
  const postComment = async (url, info) => {
    dispatch(fetchStart());
    try {
      const response = await axiosWithToken.post(`${url}`, info);
      await new Promise(resolve => setTimeout(resolve, 300));
      const comments = await getCommentsByBlogId(info.blogId);
      
      toastSuccessNotify("Comment added successfully! Thanks for sharing your thoughts.");
      return { ...response, comments };
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation failed. Please try again."
      );
      throw error;
    }
  };

  const deleteComment = async (commentId, blogId) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.delete(`comments/${commentId}`);
      toastSuccessNotify("Comment deleted successfully");
      getBlogDetail("blogs", blogId);
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation failed. Please try again."
      );
    }
  };

  const updateComment = async (commentId, blogId, commentText) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.put(`comments/${commentId}`, { comment: commentText });
      toastSuccessNotify("Comment updated successfully!");
      const comments = await getCommentsByBlogId(blogId);
      return comments;
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation failed. Please try again."
      );
      throw error;
    }
  };

  const postLike = async (url, id) => {
    try {
      await axiosWithToken.post(`${url}/${id}/postLike`);
      const currentBlog = store.getState().blog.blog;
      if (currentBlog && currentBlog._id === id) {
        getBlogDetail(url, id, true); 
      }
    } catch (error) {
      dispatch(fetchFail());
    }
  };

  const getTrendsData = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken("blogs/?page=1&limit=100");
      dispatch(getSuccess({ data: data?.data, url: "trendings" }));
    } catch (error) {
      dispatch(fetchFail());
    }
  };

  const postCommentLike = async (commentId, blogId) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(`comments/${commentId}/postLike`);
      const comments = await getCommentsByBlogId(blogId);
      return comments;
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation failed. Please try again."
      );
    }
  };

  const postCommentDislike = async (commentId, blogId) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(`comments/${commentId}/postDislike`);
      const comments = await getCommentsByBlogId(blogId);
      return comments;
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation failed. Please try again."
      );
    }
  };

  const incrementViewer = async (url, id) => {
    try {
      await axiosWithToken.post(`${url}/${id}/incrementViewer`);
      
      dispatch(incrementBlogViewer({ blogId: id }));
    } catch (error) {
      console.error("Error incrementing viewer:", error);
    }
  };

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
    incrementViewer,
    refreshComments,
  };
};

export default useBlogCall;

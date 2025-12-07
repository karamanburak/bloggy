import { useDispatch } from "react-redux";
import { fetchFail, fetchStart } from "../features/authSlice";
import useAxios from "./useAxios";
import { toastErrorNotify } from "../helper/ToastNotify";

const useAdminCall = () => {
  const dispatch = useDispatch();
  const axiosWithToken = useAxios();

  const getAllUsers = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get("users/");
      return { success: true, data: data.data || data };
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Unable to load users. Please try again."
      );
      return { success: false, error: error.message };
    }
  };

  const getUserById = async (userId) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get(`users/${userId}`);
      return { success: true, data: data.new || data };
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Unable to load user information. Please try again."
      );
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (userId, userData) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.put(`users/${userId}`, userData);
      return { success: true, data: data.new || data };
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Unable to update user. Please try again."
      );
      return { success: false, error: error.message };
    }
  };

  const deleteUser = async (userId) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.delete(`users/${userId}`);
      return { success: true };
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Unable to delete user. Please try again."
      );
      return { success: false, error: error.message };
    }
  };

  const getUserBlogs = async (userId) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get(`blogs?author=${userId}`);
      return { success: true, data: data.data || [] };
    } catch (error) {
      dispatch(fetchFail());
      return { success: false, error: error.message, data: [] };
    }
  };

  const getAllBlogs = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get("blogs/");
      return { success: true, data: data.data || [] };
    } catch (error) {
      dispatch(fetchFail());
      return { success: false, error: error.message, data: [] };
    }
  };

  const deleteBlog = async (blogId) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.delete(`blogs/${blogId}`);
      return { success: true };
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Unable to delete blog. Please try again."
      );
      return { success: false, error: error.message };
    }
  };

  const getUserComments = async (userId) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get(`comments?user=${userId}`);
      return { success: true, data: data.data || [] };
    } catch (error) {
      dispatch(fetchFail());
      return { success: false, error: error.message, data: [] };
    }
  };

  const getAllComments = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.get("comments");
      return { success: true, data: data.data || [] };
    } catch (error) {
      dispatch(fetchFail());
      return { success: false, error: error.message, data: [] };
    }
  };

  const deleteComment = async (commentId) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.delete(`comments/${commentId}`);
      return { success: true };
    } catch (error) {
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Unable to delete comment. Please try again."
      );
      return { success: false, error: error.message };
    }
  };

  return {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserBlogs,
    getAllBlogs,
    deleteBlog,
    getUserComments,
    getAllComments,
    deleteComment,
  };
};

export default useAdminCall;


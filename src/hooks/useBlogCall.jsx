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
      console.log(error);
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
      console.log(error);
      dispatch(fetchFail());
    }
  };

  const getBlogDetail = async (id) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken(`blogs/${id}`);
      dispatch(getBlogDetailSuccess(data));
      //   console.log(data);
    } catch (error) {
      console.log(error);
      dispatch(fetchFail());
    }
  };

  const deleteBlog = async (url, id) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.delete(`${url}/${id}`);
      toastSuccessNotify("Success! The blog has been deleted.");
    } catch (error) {
      console.log(error);
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
      toastSuccessNotify("Success! The blog has been added.");
    } catch (error) {
      console.log(error);
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
      toastSuccessNotify("Success! The blog has been updated.");
    } catch (error) {
      console.log(error);
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
      console.log(data.data);
      dispatch(getCommentSuccess(data));
    } catch (error) {
      console.log(error);
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation not success"
      );
    }
  };
  const postComment = async (url, info) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(`${url}`, info);
      toastSuccessNotify("Your comment has been successfully posted!");
      getBlogDetail("blogs", info.blogId);
    } catch (error) {
      console.log(error);
      dispatch(fetchFail());
      toastErrorNotify(
        error?.response?.data?.message || "Operation not success"
      );
    }
  };

  const postLike = async (url, id) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(`${url}/${id}/postLike`);
      getBlogData("blogs");
    } catch (error) {
      console.log(error);
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
      console.log(error);
      dispatch(fetchFail());
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
    getTrendsData,
  };
};

export default useBlogCall;

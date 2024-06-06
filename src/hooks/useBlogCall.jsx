import { useDispatch } from "react-redux";
import {
    fetchFail,
    fetchStart,
    getSuccess,
    getBlogDetailSuccess,
} from "../features/blogSlice";
import useAxios from "./useAxios";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";

const BASE_URL = import.meta.env.VITE_BASE_URL
const useBlogCall = () => {
    const dispatch = useDispatch()
    const axiosWithToken = useAxios()


    const getBlogData = async (url) => {
        dispatch(fetchStart());
        try {
            const { data } = await axiosWithToken(`${url}`)
            // console.log(data);
            dispatch(getSuccess({ data: data.data, url }));
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
        }
    };

    const getUserBlogs = async (userId) => {
        dispatch(fetchStart())
        try {
            const { data } = await axiosWithToken(`blogs?author=${userId}`);
            dispatch(getSuccess({ data: data.data, url: "blogs" }))
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
        }
    };

    const getBlogDetail = async (url, id) => {
        dispatch(fetchStart())
        try {
            const { data } = await axiosWithToken(`${url}/${id}`);
            dispatch(getBlogDetailSuccess(data))
            // console.log(data);
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
        }
    };

    const deleteBlog = async (url, id) => {
        dispatch(fetchStart());
        try {
            await axiosWithToken.delete(`${url}/${id}`)
            toastSuccessNotify("Blog successfully deleted")
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
            toastErrorNotify(error?.response?.data?.message || "Operation not success")
        } finally {
            getBlogData(url)
        }
    };

    const postBlog = async (url, info) => {
        dispatch(fetchStart());
        try {
            await axiosWithToken.post(url, info)
            toastSuccessNotify("Blog successfully added!")
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
            toastErrorNotify(error?.response?.data?.message || "Operation not success")
        } finally {
            getBlogData(url)
        }
    };

    const putBlog = async (url, info) => {
        dispatch(fetchStart());
        try {
            await axiosWithToken.put(`${url}/${info._id}`, info)
            toastSuccessNotify("Blog successfully changed")
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
            toastErrorNotify(error?.response?.data?.message || "Operation not success")
        } finally {
            getBlogData(url)
        }
    };


    const postComment = async (url, info) => {
        dispatch(fetchStart());
        try {
            await axiosWithToken.post(`${url}`, info)
            toastSuccessNotify("Comment successfully added!")
            getBlogDetail('blogs', info.blogId)
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
            toastErrorNotify(error?.response?.data?.message || "Operation not success")
        }
    }

    const postLike = async (url, id) => {
        dispatch(fetchStart());
        try {
            await axiosWithToken.post(`${url}/${id}/postLike`);
            getBlogData('blogs')
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
        postComment
    }
};

export default useBlogCall;

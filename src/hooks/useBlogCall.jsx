import { useSelector, useDispatch } from "react-redux";
import {
    fetchFail,
    fetchStart,
    getBlogs,
    getComments
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
            dispatch(getBlogs({ data: data.data, url }));
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
        }
    };

    const deleteBlog = async (url, id) => {
        dispatch(fetchStart());
        try {

            await axiosWithToken.delete(`${url}/${id}`)
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
        } finally {
            getBlogData(url)
            toastErrorNotify(error?.response?.data?.message || "Operation not success")
        }
    };
    const postBlog = async (url, info) => {
        dispatch(fetchStart());
        try {
            await axiosWithToken.post(`${url}`, info)
            console.log(postBlog);
            toastSuccessNotify("Item successfully added!")
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
            toastSuccessNotify("Item successfully changed")
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
            toastErrorNotify(error?.response?.data?.message || "Operation not success")

        } finally {
            getBlogData(url)
        }
    };

    return {
        getBlogData,
        deleteBlog,
        putBlog,
        postBlog,
    }
};

export default useBlogCall;

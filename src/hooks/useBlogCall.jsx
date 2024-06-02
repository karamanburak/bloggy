import { useDispatch } from "react-redux";
import {
    fetchFail,
    fetchStart,
    getSuccess,
    getBlogDetailSuccess,
    getCommentsData,
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
           const {data} =  await axiosWithToken(`${url}/${id}`);
            dispatch(getBlogDetailSuccess(data))
            // console.log(data.data.userId);
            
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
        } 
    };

    const getCommentsDetail = async (url, id) => {
        dispatch(fetchStart());
        try {
            const { data } = await axiosWithToken(`${url}/${id}`)
            // console.log(data);
            dispatch(getCommentsData({ data: data.data, url }))
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
            toastErrorNotify(error?.response?.data?.message || "Operation not success")
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
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
            toastErrorNotify(error?.response?.data?.message || "Operation not success")
        } finally {
            getBlogData()
        }
    };

    const getLike = async (url, id) => {
        dispatch(fetchStart());
        try {
            await axiosWithToken.post(`${url}/${id}/postLike`);
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
        } finally{
            getBlogData(url)
        }
    };


    return {
        getBlogData,
        deleteBlog,
        putBlog,
        postBlog,
        getCommentsDetail,
        getBlogDetail,
        getUserBlogs,
        getLike,
        postComment

    }
};

export default useBlogCall;

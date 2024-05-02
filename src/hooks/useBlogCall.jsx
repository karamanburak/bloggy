import { useSelector, useDispatch } from "react-redux";
import {
    fetchFail,
    fetchStart,
    getSuccess,
} from "../features/blogSlice";
import useAxios from "./useAxios";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";

const BASE_URL = import.meta.env.VITE_BASE_URL
const useBlogCall = () => {
    const dispatch = useDispatch()
    const { token } = useSelector(state => state.auth)
    const axiosWithToken = useAxios()


    const getBlogData = async (url) => {
        dispatch(fetchStart());
        try {
            const { data } = await axiosWithToken(`${url}`)
            // console.log(data);
            // dispatch(brandsSuccess(data.data));
            // dispatch(getSuccess({data:data.data,url:url}));//* action creatorlar her zaman tek bir parametre kabul ederler
            dispatch(getSuccess({ data: data.data, url }));//* action creatorlar her zaman tek bir parametre kabul ederler
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
        }
    };
    const deleteStockData = async (url, id) => {
        dispatch(fetchStart());
        try {
            // await axios.delete(`${BASE_URL}${url}/${id}`, {
            //     headers: {
            //         Authorization: `Token ${token}`,
            //     },
            // });
            await axiosWithToken.delete(`${url}/${id}`)
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
        } finally {
            getStockData(url)
            toastErrorNotify(error?.response?.data?.message || "Operation not success")
        }
    };
    const postStockData = async (url, info) => {
        dispatch(fetchStart());
        try {
            await axiosWithToken.post(`${url}`, info)
            toastSuccessNotify("Item successfully added!")
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
            toastErrorNotify(error?.response?.data?.message || "Operation not success")
        } finally {
            getStockData(url)
        }
    };
    const putStockData = async (url, info) => {
        dispatch(fetchStart());
        try {
            await axiosWithToken.put(`${url}/${info._id}`, info)
            toastSuccessNotify("Item successfully changed")
        } catch (error) {
            console.log(error);
            dispatch(fetchFail());
            toastErrorNotify(error?.response?.data?.message || "Operation not success")

        } finally {
            getStockData(url)
        }
    };

    const getProCatBrand = async () => {
        dispatch(fetchStart());
        try {
            const [products, categories, brands] = await Promise.all([
                axiosWithToken("products"),
                axiosWithToken("categories"),
                axiosWithToken("brands"),

            ])
            dispatch(getProCatBrandSuccess([
                products?.data?.data,
                categories?.data?.data,
                brands?.data?.data,]))
        } catch (error) {
            dispatch(fetchFail());

        }

    }

    const getProSalBrands = async () => {
        dispatch(fetchStart());
        try {
            // const { data } = await axiosWithToken.get(`stock/${url}/`);
            const [products, brands, sales] = await Promise.all([
                axiosWithToken.get(`products/`),
                axiosWithToken.get(`brands/`),
                axiosWithToken.get(`sales/`),
            ]);

            dispatch(
                getProSalBrandsSuccess([products?.data, brands?.data, sales?.data])
            );
        } catch (error) {
            dispatch(fetchFail());
        }
    };

    const getProPurcFirBrands = async () => {
        dispatch(fetchStart());
        try {
            // const { data } = await axiosWithToken.get(`stock/${url}/`);
            const [products, purchases, firms, brands] = await Promise.all([
                axiosWithToken.get(`products/`),
                axiosWithToken.get(`purchases/`),
                axiosWithToken.get(`firms/`),
                axiosWithToken.get(`brands/`),
            ]);

            dispatch(
                getProPurcFirBrandsSuccess([
                    products?.data,
                    purchases?.data,
                    firms?.data,
                    brands?.data,
                ])
            );
        } catch (error) {
            dispatch(fetchFail());
        }
    };
    const getPurcSales = async () => {
        dispatch(fetchStart());
        try {
            const [sales, purchases] = await Promise.all([
                axiosWithToken.get(`sales/`),
                axiosWithToken.get(`purchases/`),
            ]);

            dispatch(
                getPurcSalesSuccess([
                    sales?.data,
                    purchases?.data
                ])
            );
        } catch (error) {
            dispatch(fetchFail());
        }
    };

    return {
        getBlogData
    }
};

export default useBlogCall;

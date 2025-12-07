import { useDispatch } from "react-redux";
import {
  fetchStart,
  fetchFail,
  getCategories,
} from "../features/categorySlice";
import useAxios from "./useAxios";

const useCategoryCall = () => {
  const dispatch = useDispatch();
  const axiosWithToken = useAxios();

  const getCategory = async (url) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken(`${url}`);
      dispatch(getCategories({ data: data.data }));
    } catch (error) {
      dispatch(fetchFail());
    }
  };
  return { getCategory };
};
export default useCategoryCall;

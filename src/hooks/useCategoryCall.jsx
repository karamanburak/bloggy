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

  const getCategory = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken("categories");
      //   console.log(data.data);
      dispatch(getCategories({ data: data.data }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      dispatch(fetchFail());
    }
  };
  return { getCategory };
};
export default useCategoryCall;

import { useDispatch } from "react-redux";
import {
  fetchFail,
  fetchStart,
  getNewsSuccess,
  getShowsSuccess,
} from "../features/newsShowsSlice";
import axios from "axios";

const useNewsShowsCall = () => {
  const dispatch = useDispatch();

  const stripHtml = (html) => {
    let doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const getShowsData = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axios("https://api.tvmaze.com/shows");
      const cleanedData = data.slice(0, 20).map((show) => ({
        ...show,
        summary: stripHtml(show.summary),
      }));
      dispatch(getShowsSuccess(cleanedData));
    } catch (error) {
      console.log(error);
      dispatch(fetchFail());
    }
  };
  const getNewsData = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axios();
      dispatch(getNewsSuccess(data));
      console.log(data);
    } catch (error) {
      console.log(error);
      dispatch(fetchFail());
    }
  };
  return {
    getShowsData,
    getNewsData,
  };
};

export default useNewsShowsCall;

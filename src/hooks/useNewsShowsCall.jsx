import { useDispatch } from "react-redux";
import {
  fetchFail,
  fetchStart,
  getNewsSuccess,
  getShowsSuccess,
} from "../features/newsShowsSlice";
import axios from "axios";

const newsApiKey = import.meta.env.VITE_NEWS_apiKey;

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
      const cleanedData = data.slice(0, 20).map((show, index) => ({
        ...show,
        summary: stripHtml(show.summary),
        key: `show-${index}`,
      }));
      // console.log(cleanedData);
      dispatch(getShowsSuccess(cleanedData));
    } catch (error) {
      console.log(error);
      dispatch(fetchFail());
    }
  };

  const getNewsData = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axios(
        `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&apikey=${newsApiKey}`
      );
      dispatch(getNewsSuccess(data.articles));
      // console.log(data.articles);
    } catch (error) {
      console.error(error);
      dispatch(fetchFail());
    }
  };

  return {
    getShowsData,
    getNewsData,
  };
};

export default useNewsShowsCall;

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
      const { data } = await axios.get(
        "https://flixster.p.rapidapi.com/news/list",
        {
          headers: {
            "x-rapidapi-key": newsApiKey,
            "x-rapidapi-host": "flixster.p.rapidapi.com",
          },
        }
      );
      dispatch(getNewsSuccess(data.data.newsStories));
      console.log(data.data.newsStories);
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

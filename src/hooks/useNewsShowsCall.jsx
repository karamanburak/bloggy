import { useDispatch } from "react-redux";
import {
  fetchFail,
  fetchStart,
  getBooksSuccess,
  getNewsSuccess,
  getShowsSuccess,
} from "../features/newsShowsSlice";
import axios from "axios";

const newsApiKey = import.meta.env.VITE_NEWS_apiKey;
const API_KEY = import.meta.env.VITE_TMDB_KEY;
const url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${API_KEY}`;
const booksApiKey = import.meta.env.VITE_BOOKS_NY_apiKey;
const booksUrl = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${booksApiKey}`;
const useNewsShowsCall = () => {
  const dispatch = useDispatch();

  const getShowsData = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axios(url);
      // console.log(data.results);
      dispatch(getShowsSuccess(data.results));
    } catch (error) {
      console.log(error);
      dispatch(fetchFail());
    }
  };

  const getBooksData = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axios(booksUrl);

      console.log(data.results.books);
      dispatch(getBooksSuccess(data.results.books));
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
      console.error(error.response.data.errors);
      dispatch(fetchFail());
    }
  };

  return {
    getShowsData,
    getNewsData,
    getBooksData,
  };
};

export default useNewsShowsCall;

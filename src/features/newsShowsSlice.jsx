import { createSlice } from "@reduxjs/toolkit";

const newsShowsSlice = createSlice({
  name: "newsShows",
  initialState: {
    news: [],
    shows: [],
    loading: false,
    error: false,
  },
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    getNewsSuccess: (state, { payload }) => {
      state.loading = false;
      state.news = payload;
    },
    getShowsSuccess: (state, { payload }) => {
      state.loading = false;
      state.shows = payload;
    },
    fetchFail: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});

export const { fetchStart, getNewsSuccess, getShowsSuccess, fetchFail } =
  newsShowsSlice.actions;

export default newsShowsSlice.reducer;

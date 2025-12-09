import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blogs",

  initialState: {
    blogs: [],
    blog: {},
    comments: [],
    trendings: [],
    likeCounts: "",
    loading: false,
    error: false,
  },
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = false;
    },

    getSuccess: (state, { payload: { data, url } }) => {
      state.loading = false;
      state[url] = data;
    },

    getBlogDetailSuccess: (state, { payload }) => {
      state.loading = false;
      state.blog = payload.data;
    },

    getCommentSuccess: (state, { payload }) => {
      state.loading = false;
      state.comments = payload.data;
    },

    postBlogs: (state, { payload }) => {
      state.loading = false;
      state.blogs = payload.data;
    },

    fetchFail: (state) => {
      state.loading = false;
      state.error = true;
    },

    incrementBlogViewer: (state, { payload: { blogId } }) => {
      // Update countOfVisitors in blogs array
      const blogIndex = state.blogs.findIndex((b) => b._id === blogId);
      if (blogIndex !== -1 && state.blogs[blogIndex]) {
        state.blogs[blogIndex].countOfVisitors = (state.blogs[blogIndex].countOfVisitors || 0) + 1;
      }
      
      // Update countOfVisitors in blog detail if it matches
      if (state.blog && state.blog._id === blogId) {
        state.blog.countOfVisitors = (state.blog.countOfVisitors || 0) + 1;
      }
    },

    updateBlogComments: (state, { payload: { comments } }) => {
      state.loading = false;
      if (state.blog && state.blog._id) {
        state.blog.comments = comments;
      }
    },
  },
});

export const {
  fetchStart,
  getSuccess,
  getCommentsData,
  getBlogDetailSuccess,
  getBlogSuccess,
  getCommentSuccess,
  fetchFail,
  incrementBlogViewer,
  updateBlogComments,
} = blogSlice.actions;

export default blogSlice.reducer;

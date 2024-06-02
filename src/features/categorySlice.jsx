import { createSlice } from '@reduxjs/toolkit'

const blogSlice = createSlice({
    name: "category",

    initialState: {
        categories: [],
        loading: false,
        error: false
    },
    reducers: {
        fetchStart: state => {
            state.loading = true;
            state.error = false;
        },

        getCategories: (state, {payload}) => {
            state.loading = false;
            state.categories = payload.data
        },
        fetchFail: state => {
            state.loading = false;
            state.error = true;
        },
    }
});
export const {
    fetchStart,
    getCategories,
    fetchFail
} = blogSlice.actions;

export default blogSlice.reducer;
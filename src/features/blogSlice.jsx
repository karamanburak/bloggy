import {createSlice} from '@reduxjs/toolkit'

const blogSlice = createSlice({
    name:"blogs",

    initialState:{
        blogs:[],
        blog:{},
        comments: [],
        comment: {},
        loading:false,
        error:false
    },
    reducers:{
        fetchStart:state=> {
            state.loading = true;
            state.error= false;
        },

        getBlogs : (state,{payload:{data,url}}) => {
            state.loading = false;
            state[url] = data
        },
        postBlogs : (state,{payload}) => {
            state.loading = false;
            state[payload.url] = payload.data
        },
        getComments: (state, { payload }) => {
            state.loading = false;
            state.payload = payload?.data
        },
        fetchFail: state => {
            state.loading = false;
            state.error = true;
        },
    }
});

export const {
    fetchStart,
    getBlogs,
    getComments,
    fetchFail
} = blogSlice.actions;

export default blogSlice.reducer;
import {createSlice} from '@reduxjs/toolkit'

const blogSlice = createSlice({
    name:"blogs",

    initialState:{
        blogs:[],
        blog:{},
        likeCounts:"",
        loading:false,
        error:false
    },
    reducers:{
        fetchStart:state=> {
            state.loading = true;
            state.error= false;
        },

        getSuccess : (state,{payload:{data,url}}) => {
            state.loading = false;
            state[url] = data
        },

        getBlogDetailSuccess: (state, {payload}) => {
            state.loading = false;
            state.blog = payload.data
        },

        postBlogs : (state,{payload}) => {
            state.loading = false;
            state.blogs = payload.data
        },


        fetchFail: state => {
            state.loading = false;
            state.error = true;
        },
    }
});

export const {
    fetchStart,
    getSuccess,
    getCommentsData,
    getBlogDetailSuccess,
    getBlogSuccess,
    fetchFail,
} = blogSlice.actions;

export default blogSlice.reducer;
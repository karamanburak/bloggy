import {createSlice} from '@reduxjs/toolkit'

const blogSlice = createSlice({
    name:"blogs",

    initialState:{
        blogs:[],
        blog:{},
        comments: [],
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
        getCommentsData : (state,{payload}) => {
            state.loading = false;
            state.comments = payload.data.comments
        },

        postBlogs : (state,{payload}) => {
            state.loading = false;
            state[payload.url] = payload.data
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
    fetchFail,
} = blogSlice.actions;

export default blogSlice.reducer;
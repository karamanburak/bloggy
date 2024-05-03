import { useEffect } from "react";
import useBlogCall from "../hooks/useBlogCall";
import { useSelector } from 'react-redux';
import BlogCard from "../components/blog/BlogCard";
import { Button, Container, Grid } from "@mui/material";
import Footer from "../components/home/Footer";
import { useState } from "react";
import BlogModal from "../components/blog/BlogModal";
import useCategoryCall from "../hooks/useCategoryCall";
import loadingGif from '../assets/loading.gif'


const Blogs = () => {
  const { getBlogData } = useBlogCall()
  const { getCategory } = useCategoryCall()
  const { blogs, loading } = useSelector(state => state.blog)
  const { categories } = useSelector(state => state.category)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
  }
  const [initialState, setInitialState] = useState({
    categoryId: "",
    title: "",
    content: "",
    image: "",
    isPublish: "",
  })

  useEffect(() => {
    getBlogData("blogs")
    getCategory("categories")
  }, [])


  return (
    <>
      <Container maxWidth="100vw" sx={{minHeight:"100vh", backgroundColor: "primary.main", paddingBottom:"1rem",margin: "auto"}}>
      <Button 
      onClick={handleOpen}
      variant="contained" 
      sx={{backgroundColor:"primary.light", 
      display:"block", 
      marginLeft:"auto"
      }}
      
      >
        New Blog
      </Button>
        <Grid container spacing={1} mt={3} >
          {loading ? (
            <img src={loadingGif} alt="loading..." height={500} style={{margin:"auto"}}/>
          ) : (
          blogs.map((blog) => (
            <Grid item xs={12} md={6} lg={4} xl={3} key={blog._id} sx={{display:"flex",alignItems:"stretch"}}>
              <BlogCard {...blog}/>
            </Grid>
          )))}
        </Grid>
      </Container>
      {open && (
        <BlogModal
          open={open}
          categories={categories}
          handleClose={handleClose}
          initialState={initialState}
        />
      )}    
      <Footer />
    </>
  )
};

export default Blogs;

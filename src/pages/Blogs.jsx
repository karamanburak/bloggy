import { useEffect } from "react";
import useBlogCall from "../hooks/useBlogCall";
import { useSelector } from 'react-redux';
import BlogCard from "../components/blog/BlogCard";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
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
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

  // Calculate current blogs to display
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    getBlogData("blogs")
    getCategory("categories")
  }, [])


  return (
    <>
      <Container maxWidth="100vw" sx={{minHeight:"100vh", backgroundColor: "primary.main", paddingBottom:"1rem",margin: "auto"}}>
      <Box sx={{height:"1rem"}}></Box>
      <Button 
      onClick={handleOpen}
      variant="contained" 
      sx={{backgroundColor:"primary.light", 
      display:"block", 
      marginLeft:"auto",
      marginRight:"1.8rem"

      }}
      
      >
        New Blog
      </Button>
        <Grid container spacing={1} mt={3} >
          {loading ? (
            <img src={loadingGif} alt="loading..." height={500} style={{margin:"auto"}}/>
          ) : (
              currentBlogs.map((blog) => (
            <Grid item xs={12} md={6} lg={4} xl={3} key={blog._id} sx={{display:"flex",alignItems:"stretch"}}>
              <BlogCard {...blog}/>
            </Grid>
          )))}
        </Grid>
      <Typography style={{ marginTop: "20px", textAlign: "center" }}>
        {Array.from({ length: Math.ceil(blogs.length / blogsPerPage) }).map(
          (_, index) => (
            <Button
              key={index}
              onClick={() => paginate(index + 1)}
              variant={currentPage === index + 1 ? "contained" : "outlined"}
              sx={{ margin: "5px", color: "indianred", backgroundColor:currentPage === index + 1 ? "primary.light" : "" }}
            >
              {index + 1}
            </Button>
          )
        )}
      </Typography>
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

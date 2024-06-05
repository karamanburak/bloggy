import { useEffect } from "react";
import useBlogCall from "../hooks/useBlogCall";
import { useSelector } from 'react-redux';
import BlogCard from "../components/blog/BlogCard";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Footer from "../components/home/Footer";
import { useState } from "react";
import BlogModal from "../components/blog/BlogModal";
import loadingGif from '../assets/loading.gif'


const Blogs = () => {
  const { getBlogData } = useBlogCall()
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
  }, [])


  return (
    <Box sx={{ backgroundColor: "primary.main", paddingTop: "1.5rem" }}>
      <Button
        onClick={handleOpen}
        variant="contained"
        sx={{
          backgroundColor: "primary.light",
          display: "block",
          marginLeft: "auto",
          marginRight: "3.5rem",

        }}

      >
        New Blog
      </Button>
      <Container maxWidth="100vw" sx={{
        minHeight: "90vh",
        paddingBottom: "1rem",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Grid container spacing={1} mt={3} >
          {loading ? (
            <img src={loadingGif} alt="loading..." height={500} style={{ margin: "auto" }} />
          ) : (
            currentBlogs.map((blog) => (
              <Grid item xs = { 12} md = { 6} lg = { 4} xl = { 3} key = { blog._id }>
                <BlogCard {...blog} />
              </Grid>
            )))}
        </Grid>
        <Typography style={{  marginTop: "20px", textAlign: "center" }}>
          {Array.from({ length: Math.ceil(blogs.length / blogsPerPage) }).map(
            (_, index) => (
              <Button
                key={index}
                onClick={() => paginate(index + 1)}
                variant={currentPage === index + 1 ? "contained" : "outlined"}
                sx={{ margin: "5px", color: "indianred", backgroundColor: currentPage === index + 1 ? "primary.light" : "" }}
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
    </Box>
  )
};

export default Blogs;

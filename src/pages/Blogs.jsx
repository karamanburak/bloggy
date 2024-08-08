import { useEffect } from "react";
import useBlogCall from "../hooks/useBlogCall";
import { useSelector } from 'react-redux';
import BlogCard from "../components/blog/BlogCard";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Footer from "../components/home/Footer";
import { useState } from "react";
import BlogModal from "../components/blog/BlogModal";
import loadingGif from '../assets/loading.gif'
import useCategoryCall from "../hooks/useCategoryCall";
import TrendBlogs from "../components/blog/TrendBlogs";
import { BsPencilSquare } from "react-icons/bs";
import blogRatings from '../assets/blog-video.mp4'



const Blogs = () => {
  const { getBlogData } = useBlogCall()
  const { blogs, loading } = useSelector(state => state.blog)
  const { categories } = useSelector(state => state.category)
  const { getCategory } = useCategoryCall()
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
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(blogs.length / blogsPerPage)));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    getBlogData("blogs")
    getCategory("categories")
  }, [])


  return (
    <Box sx={{ backgroundColor: "primary.main" }}>
      <video
        src={blogRatings}
        alt="home video"
        width="100%"
        // height="720px"
        autoPlay
        loop
        muted
        playsInline
        style={{ objectFit: 'cover', marginBottom: "1rem", minHeight: "100vh" }}
      />
      <TrendBlogs />
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
              <Grid item xs={12} md={6} lg={4} xl={3} key={blog._id}>
                <BlogCard {...blog} />
              </Grid>
            )))}
        </Grid>
        <Typography style={{ marginTop: "20px", textAlign: "center" }}>
          <Button
            onClick={prevPage}
            variant="outlined"
            disabled={currentPage === 1}
            sx={{ margin: "5px", color: "indianred" }}
          >
            &lt; Previous
          </Button>
          {Array.from({ length: Math.ceil(blogs.length / blogsPerPage) }).map(
            (_, index) => (
              <Button
                key={index}
                onClick={() => paginate(index + 1)}
                variant={currentPage === index + 1 ? "contained" : "outlined"}
                sx={{
                  margin: "5px",
                  color: "indianred",
                  backgroundColor: currentPage === index + 1 ? "neutral.dark" : "",
                  borderRadius: "50%",
                  minWidth: "36px",
                  minHeight: "36px",
                }}
              >
                {index + 1}
              </Button>
            )
          )}
          <Button
            onClick={nextPage}
            variant="outlined"
            disabled={currentPage === Math.ceil(blogs.length / blogsPerPage)}
            sx={{ margin: "5px", color: "indianred" }}
          >
            Next &gt;
          </Button>
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

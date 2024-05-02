import { useEffect } from "react";
import useBlogCall from "../hooks/useBlogCall";
import { useSelector } from 'react-redux';
import BlogCard from "../components/blog/BlogCard";
import { Container, Grid } from "@mui/material";
import Footer from "../components/home/Footer";


const Blogs = () => {
  const { getBlogData } = useBlogCall()
  const { blogs } = useSelector(state => state.blog)

  useEffect(() => {
    getBlogData("blogs")
  }, [])


  return (
    <>
      <Container maxWidth="100vw" sx={{ backgroundColor: "primary.main", paddingBottom:"1rem" }}>
        <Grid container spacing={1} sx={{margin:"auto",marginLeft:"1rem"}}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={blog._id} sx={{display:"flex",alignItems:"stretch"}}>
              <BlogCard  {...blog} />
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  )
};

export default Blogs;

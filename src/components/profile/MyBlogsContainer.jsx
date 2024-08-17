import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Typography, Box, Button } from "@mui/material";
import MyBlogsCard from "./MyBlogsCard";
import useBlogCall from "../../hooks/useBlogCall";
import loadingGif from "../../assets/loading.gif";

const MyBlogsContainer = ({ userId }) => {
  const { getUserBlogs, getBlogData } = useBlogCall();
  const { blogs, loading } = useSelector((state) => state.blog);
  // console.log(blogs);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 2;

  const userBlogs = blogs.filter((blog) => blog.userId._id === userId);

  // console.log(userBlogs);

  useEffect(() => {
    getUserBlogs(userId);
    getBlogData("blogs");
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = userBlogs.slice(
    indexOfFirstBlog,
    indexOfFirstBlog + blogsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(userBlogs.length / blogsPerPage))
    );
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      {loading ? (
        <img src={loadingGif} alt="loading..." height={500} />
      ) : userBlogs.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center", mt: 10 }}>
          You haven't written any blogs yet. Start sharing your thoughts today!
        </Typography>
      ) : (
        <Box>
          {currentBlogs?.map((blog) => (
            <MyBlogsCard key={blog._id} {...blog} />
          ))}
        </Box>
      )}

      {userBlogs?.length > 0 && (
        <Typography style={{ marginTop: "20px", textAlign: "center" }}>
          <Button
            onClick={prevPage}
            variant="outlined"
            disabled={currentPage === 1}
            sx={{ margin: "5px", color: "indianred" }}
          >
            &lt; Previous
          </Button>
          {Array.from({
            length: Math.ceil(userBlogs.length / blogsPerPage),
          }).map((_, index) => (
            <Button
              key={index}
              onClick={() => paginate(index + 1)}
              variant={currentPage === index + 1 ? "contained" : "outlined"}
              sx={{
                margin: "5px",
                color: "indianred",
                backgroundColor:
                  currentPage === index + 1 ? "primary.light" : "",
                borderRadius: "50%",
                minWidth: "36px",
                minHeight: "36px",
              }}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            onClick={nextPage}
            variant="outlined"
            disabled={
              currentPage === Math.ceil(userBlogs.length / blogsPerPage)
            }
            sx={{ margin: "5px", color: "indianred" }}
          >
            Next &gt;
          </Button>
        </Typography>
      )}
    </Container>
  );
};

export default MyBlogsContainer;

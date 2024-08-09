import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import useBlogCall from "../../hooks/useBlogCall";
import MyBlogsCard from "./MyBlogsCard";
import { useState } from "react";
import loadingGif from "../../assets/loading.gif";

const MyBlogsContainer = ({ _id }) => {
  const { getUserBlogs } = useBlogCall();
  const { blogs, loading } = useSelector((state) => state.blog);

  // console.log(blogs);

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 2;

  useEffect(() => {
    getUserBlogs(_id);
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  // console.log(currentBlogs);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(blogs.length / blogsPerPage))
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
      ) : (
        <Box>
          {getUserBlogs &&
            currentBlogs.map((blog) => (
              <MyBlogsCard key={blog._id} {...blog} />
            ))}
        </Box>
      )}
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
                backgroundColor:
                  currentPage === index + 1 ? "primary.light" : "",
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
  );
};

export default MyBlogsContainer;

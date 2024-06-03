import { Box, Button, Container, Typography } from '@mui/material';
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import useBlogCall from '../../hooks/useBlogCall';
import MyBlogsCard from './MyBlogsCard';
import { useState } from 'react';
import loadingGif from '../../assets/loading.gif'




const MyBlogsContainer = ({ _id }) => {
    const { getUserBlogs } = useBlogCall();
    const { blogs, loading } = useSelector(state => state.blog)

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

    return (
        <Container sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "135vh",
        }}>
            {loading ? (
                <img src={loadingGif} alt="loading..." height={500} />
            ) : (
                <Box>
                    {getUserBlogs ? (currentBlogs.map((blog) => (
                        <MyBlogsCard key={blog._id} {...blog} />
                    ))) : ""
                    }
                </Box>
            )}
            <Typography style={{ marginTop: "20px", textAlign: "center" }}>
                {Array.from({ length: Math.ceil(blogs.length / blogsPerPage) }).map(
                    (_, index) => (
                        <Button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            variant={currentPage === index + 1 ? "contained" : "outlined"}
                            sx={{ margin: "5px", color: "indianred" }}
                        >
                            {index + 1}
                        </Button>
                    )
                )}
            </Typography>
        </Container>
    )
};

export default MyBlogsContainer;

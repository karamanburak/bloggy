import { Button, Container, Typography } from '@mui/material';
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import useBlogCall from '../../hooks/useBlogCall';
import MyBlogsCard from './MyBlogsCard';
import { useState } from 'react';



const MyBlogsContainer = () => {
    const { getUserBlogs } = useBlogCall();
    const  curentUser  = useSelector(state => state.auth)
    const  {blogs}  = useSelector(state => state.blog)
    // console.log(blogs);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 3;

    useEffect(() => {
        getUserBlogs(curentUser._id);
    }, []);




    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container>
            {currentBlogs.map((blog) => (
                <MyBlogsCard key={blog._id} {...blog} />
            ))}
            <Typography style={{ marginTop: "20px",textAlign:"center" }}>
                {Array.from({ length: Math.ceil(blogs.length / blogsPerPage) }).map(
                    (_, index) => (
                        <Button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            variant={currentPage === index + 1 ? "contained" : "outlined"}
                            sx={{ margin: "5px", color:"indianred" }}
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

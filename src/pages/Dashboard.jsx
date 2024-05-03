import { Box, Card, Container, Typography } from '@mui/material';
import home from '../assets/home.png'
import HomeCard from '../components/home/HomeCard';
import Footer from '../components/home/Footer';
import { useEffect } from "react";
import useBlogCall from '../hooks/useBlogCall';
import { useSelector } from 'react-redux';
import { spanStyle, wellcomeMessage } from '../styles/globalStyles';




const Dashboard = () => {
    const isDashboard = '/'
    const { getBlogData } = useBlogCall()
    const { blogs } = useSelector(state => state.blog)

    useEffect(() => {
        getBlogData("blogs")
    }, [])


    return (
        <Box
            sx={{ backgroundColor: "primary.dark" }} >
            <img src={home} alt="image" width="100%" />
            <Container>
                <Box sx={wellcomeMessage}>
                        <span style={spanStyle}>Welcome to the Bloggy</span>
                </Box>
                {blogs.map((blog) => (
                        <HomeCard key={blog._id} {...blog} />
                ))}
            </Container>
            <Box sx={{ marginTop: "2rem" }}>
                <Footer isDashboard={isDashboard} />
            </Box>
        </Box>
    )
};

export default Dashboard;

import { Box, Card, Container, Typography } from '@mui/material';
import home from '../assets/home.png'
import HomeCard from '../components/home/HomeCard';
import Footer from '../components/home/Footer';
import { useEffect } from "react";
import useBlogCall from '../hooks/useBlogCall';
import { useSelector } from 'react-redux';
import { spanStyle, wellcomeMessage } from '../styles/globalStyles';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import Quotes from '../components/home/Quotes';
import loadingGif from '../assets/loading.gif'


const Dashboard = () => {
    const isDashboard = '/'
    const { getBlogData } = useBlogCall()
    const { blogs, loading } = useSelector(state => state.blog)

    useEffect(() => {
        getBlogData("blogs")
    }, [])


    return (
        <Box
            sx={{ backgroundColor: "primary.dark" }} >
            <img src={home} alt="image" width="100%" />
            <Container>
                <Box sx={wellcomeMessage}>
                    <Typography variant='span' style={spanStyle}>Welcome to the Bloggy</Typography>
                </Box>
                <Box sx={wellcomeMessage}>
                    <Quotes/>
                </Box>
                {loading ? (
                    <img src={loadingGif} alt="loading..." height={500} style={{display:"flex",margin:"auto"}} />
                ) : (
                     <Slide>
                    {blogs.map((blog) => (
                        <HomeCard key={blog._id} {...blog} />
                    ))}
                </Slide>
                    )}
               
            </Container>
            <Box sx={{ marginTop: "2rem" }}>
                <Footer isDashboard={isDashboard} />
            </Box>
        </Box>
    )
};

export default Dashboard;

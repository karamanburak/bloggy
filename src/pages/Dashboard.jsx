import { Box, Container, Typography } from '@mui/material';
import home from '../assets/home.png'
import homeVideo from '../assets/home-video.mp4'
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
import { useState } from 'react';
import axios from 'axios';
import ShowsCard from '../components/home/ShowsCard';
import NewsCard from '../components/home/NewsCard';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, A11y } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import '../../index.css'
import CustomSwiper from '../components/home/CustomSwiper';

const url = 'https://api.tvmaze.com/shows'
const Dashboard = () => {
    const isDashboard = '/'
    const { getBlogData } = useBlogCall()
    const { blogs, loading } = useSelector(state => state.blog)
    const [shows, setShows] = useState([])
    const [news, setNews] = useState([])


    const getShows = async () => {
        try {
            const { data } = await axios(url)
            setShows(data.slice(0, 10))
            // console.log(data);

        } catch (error) {
            console.log(error);

        }
    }

    // const getNews = async () => {
    //     try {
    //         const { data } = await axios(newsUrl)
    //         setNews(data.articles)
    //         console.log(data.data);

    //     } catch (error) {
    //         console.log(error);

    //     }
    // }


    useEffect(() => {
        getBlogData("blogs")
        // getNews()
        getShows()
    }, [])


    return (
        <Box
            sx={{ backgroundColor: "primary.main" }} >
            {/* <img src={home} alt="image" width="100%" height="500px" /> */}
            <video
                src={homeVideo}
                alt="home video"
                width="100%"
                // height="720px"
                autoPlay
                loop
                muted
                playsInline
                style={{ objectFit: 'cover', minHeight: "100vh" }}
            />

            <Container maxWidth="xl">
                {/* <Box sx={{ ...wellcomeMessage }}>
                    <Typography variant='span' style={{ ...spanStyle, fontFamily: "Dancing Script, cursive", fontSize: "2rem" }}>Welcome to the Bloggy</Typography>
                </Box> */}
                <Box sx={wellcomeMessage}>
                    {/* <Quotes /> */}
                </Box>
                <Box>
                    {loading ? (
                        <img src={loadingGif} alt="loading..." height={500} style={{ display: "flex", margin: "auto" }} />
                    ) : (
                        <CustomSwiper items={blogs} ItemComponent={HomeCard} />
                    )}
                </Box>
                <Box>
                    {loading ? (
                        ""
                    ) : (
                        <CustomSwiper items={news} ItemComponent={NewsCard} />
                    )}
                </Box>
                <Box>
                    {loading ? (
                        ""
                    ) : (
                        <CustomSwiper items={shows} ItemComponent={ShowsCard} />
                    )}
                </Box>
            </Container >
            <Box sx={{ marginTop: "2rem" }}>
                <Footer isDashboard={isDashboard} />
            </Box>
        </Box >
    )
};

export default Dashboard;

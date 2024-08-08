import { Box, Container } from '@mui/material';
import homeVideo from '../assets/home-video.mp4'
import HomeCard from '../components/home/HomeCard';
import Footer from '../components/home/Footer';
import { useEffect } from "react";
import useBlogCall from '../hooks/useBlogCall';
import { useSelector } from 'react-redux';
import { wellcomeMessage } from '../styles/globalStyles';
import 'react-slideshow-image/dist/styles.css'
import loadingGif from '../assets/loading.gif'
import { useState } from 'react';
import axios from 'axios';
import ShowsCard from '../components/home/ShowsCard';
import NewsCard from '../components/home/NewsCard';
import CustomSwiper from '../components/home/CustomSwiper';
import useCategoryCall from '../hooks/useCategoryCall';

const url = 'https://api.tvmaze.com/shows'
const newsUrl = `https://newsdata.io/api/1/news?apikey=pub_501441ed8ff166a7c3eaaf49a432d41877dde&q=news&country=de&language=en&category=technology `
const Dashboard = () => {
    const isDashboard = '/'
    const { getBlogData } = useBlogCall()
    const { getCategory } = useCategoryCall()
    const { blogs, loading } = useSelector(state => state.blog)
    const [shows, setShows] = useState([])
    const [news, setNews] = useState([])


    const stripHtml = (html) => {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    const getShows = async () => {
        try {
            const { data } = await axios(url)
            const cleanedData = data.slice(0, 20).map(show => ({
                ...show,
                summary: stripHtml(show.summary)
            }));
            setShows(cleanedData);

        } catch (error) {
            console.log(error);
        }
    }

    const getNews = async () => {
        try {
            const { data } = await axios(newsUrl)
            setNews(data)
            console.log(data);

        } catch (error) {
            console.log(error);

        }
    }


    useEffect(() => {
        getBlogData("blogs")
        getCategory("categories")
        // getNews() //* just development enviroment
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
                    <CustomSwiper items={news} ItemComponent={NewsCard} />
                    <CustomSwiper items={shows} ItemComponent={ShowsCard} />

                </Box>
            </Container >
            <Box sx={{ marginTop: "2rem" }}>
                <Footer isDashboard={isDashboard} />
            </Box>
        </Box >
    )
};

export default Dashboard;

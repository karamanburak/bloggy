import { Box, Container, Typography } from '@mui/material';
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
import { useState } from 'react';
import axios from 'axios';
import ShowsCard from '../components/home/ShowsCard';
import NewsCard from '../components/home/NewsCard';
import MealsCard from '../components/home/MealsCard';

const url = 'https://api.tvmaze.com/shows'
const url2 = `https://newsapi.org/v2/everything?domains=wsj.com&apiKey=${import.meta.env.VITE_News_ApiKey}`
const url3 = 'https://www.themealdb.com/api/json/v1/1/categories.php'

const Dashboard = () => {
    const isDashboard = '/'
    const { getBlogData } = useBlogCall()
    const { blogs, loading } = useSelector(state => state.blog)
    const [shows, setShows] = useState([])
    const [news, setNews] = useState([])
    const [meals, setMeals] = useState([])

    const getNews = async () => {
        try {
            const { data } = await axios(url2)
            setNews(data.articles)
            console.log(data.articles);

        } catch (error) {
            console.log(error);

        }
    }

    const getShows = async () => {
        try {
            const { data } = await axios(url)
            setShows(data)

        } catch (error) {
            console.log(error);

        }
    }

    const getMeal = async () => {
        try {
            const { data } = await axios(url3)
            setMeals(data.categories)
            console.log(data.categories);

        } catch (error) {
            console.log(error);

        }
    }


    useEffect(() => {
        getBlogData("blogs")
        getShows()
        getNews()
        getMeal()
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
                    <Quotes />
                </Box>
                {loading ? (
                    <img src={loadingGif} alt="loading..." height={500} style={{ display: "flex", margin: "auto" }} />
                ) : (
                    <Box>
                        <Slide>
                            {blogs.map((blog) => (
                                <HomeCard key={blog._id} {...blog} />
                            ))}
                        </Slide>
                        <Slide>
                            {news.map((news) => (
                                <NewsCard key={news.content} {...news} />
                            ))}
                        </Slide>
                        <Slide>
                            {shows.map(show => (
                                <ShowsCard key={show.id} {...show} />
                            ))}
                        </Slide>
                        <Slide>
                            {meals.map(meal => (
                                <MealsCard key={meal.idCategory} {...meal} />
                            ))}
                        </Slide>
                    </Box>
                )}
            </Container>
            <Box sx={{ marginTop: "2rem" }}>
                <Footer isDashboard={isDashboard} />
            </Box>
        </Box>
    )
};

export default Dashboard;

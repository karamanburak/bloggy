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

const url = 'https://api.tvmaze.com/shows'
const url2 = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${import.meta.env.VITE_BOOKS_apiKey}`
const Dashboard = () => {
    const isDashboard = '/'
    const { getBlogData } = useBlogCall()
    const { blogs, loading } = useSelector(state => state.blog)
    const [shows, setShows] = useState([])
    const [books, setBooks] = useState([])


    const getBooks = async () => {
        try {
            const  {data} = await axios(url2)
            setBooks(data.results.books)
            // console.log(data);
            

        } catch (error) {
            console.log(error);

        }
    }




    const getShows = async () => {
        try {
            const { data } = await axios(url)
            setShows(data)
            // console.log(data);

        } catch (error) {
            console.log(error);

        }
    }


    useEffect(() => {
        getBlogData("blogs")
        getShows()
        getBooks()
    }, [])


    return (
        <Box
            sx={{ backgroundColor: "primary.dark" }} >
            <img src={home} alt="image" width="100%" height="500px" />

            <Container>
                <Box sx={{ ...wellcomeMessage, borderRadius: "1rem" }}>
                    <Typography variant='span' style={spanStyle}>Welcome to the Bloggy</Typography>
                </Box>
                <Box sx={wellcomeMessage}>
                    <Quotes />
                </Box>
                <Box>
                    {loading ? (
                        <img src={loadingGif} alt="loading..." height={500} style={{ display: "flex", margin: "auto" }} />
                    ) : (
                        <Slide>
                            {blogs.map((blog) => (
                                <HomeCard key={blog._id} {...blog} />
                            ))}
                        </Slide>
                    )}
                </Box>
                <Box>
                    {loading ? (
                        <img src={loadingGif} alt="loading..." height={500} style={{ display: "flex", margin: "auto" }} />
                    ) : (
                        <Slide>
                            {shows.map((show) => (
                                <ShowsCard key={show.id} {...show} />
                            ))}
                        </Slide>
                    )}
                </Box>
                <Box>
                    {loading ? (
                        <img src={loadingGif} alt="loading..." height={500} style={{ display: "flex", margin: "auto" }} />
                    ) : (
                        <Slide>
                            {books.map((booksItem, index) => (
                                <NewsCard key={index} {...booksItem} />
                            ))}
                        </Slide>
                    )}
                </Box>

            </Container>
            <Box sx={{ marginTop: "2rem" }}>
                <Footer isDashboard={isDashboard} />
            </Box>
        </Box>
    )
};

export default Dashboard;

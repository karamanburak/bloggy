import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import useBlogCall from "../../hooks/useBlogCall";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Typography } from "@mui/material";
import { FaChartBar } from "react-icons/fa";
import { MdOutlineVisibility } from "react-icons/md";
import { useNavigate } from 'react-router-dom';




const TrendBlogs = () => {
    const { getTrendsData } = useBlogCall()
    const { trendings, blogs } = useSelector(state => state.blog)
    // console.log(trendings);
    const navigate = useNavigate()




    useEffect(() => {
        getTrendsData()
    }, [])


    return (
        <Container maxWidth={'lg'}  >
            <Box>
                <Typography variant='h5' sx={{ color: "neutral.light" }}> <FaChartBar />  Trendings on Bloggy </Typography> <hr />
            </Box>
            <Box>
                <Swiper
                    modules={[Navigation, Pagination, A11y, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000 }}
                    breakpoints={{
                        300: {
                            slidesPerView: 1,
                            spaceBetween: 5,
                        },
                        700: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                        900: {
                            slidesPerView: 4,
                            spaceBetween: 15,
                        },
                        1400: {
                            slidesPerView: 5,
                            spaceBetween: 20,
                        },
                    }}
                >
                    {[...trendings].sort((a, b) => b.countOfVisitors - a.countOfVisitors).map((blog) => {
                        const { _id, content, image, title, userId, createdAt, likes, countOfVisitors, categoryId } = blog
                        return (
                            <SwiperSlide key={blog._id}>
                                <Card sx={{ width: 210, height: 250, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                    <CardMedia
                                        component="img"
                                        height="120"
                                        image={image}
                                        alt={image}

                                    />
                                    <CardContent>
                                        <Typography sx={{ textAlign: "center" }}>
                                            {title}
                                        </Typography>
                                        <hr />

                                    </CardContent>
                                    <Button
                                        onClick={() => navigate(`/blog/detail/${_id}`, { state: { _id, content, image, title, userId, createdAt, likes, countOfVisitors, categoryId } })}
                                        variant='contained' sx={{ color: "neutral.light", backgroundColor: "primary.light", cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                                        <Typography>
                                            <MdOutlineVisibility />
                                            <sup>{countOfVisitors}</sup>
                                        </Typography>
                                        More...
                                    </Button>
                                </Card>
                            </SwiperSlide>
                        );

                    })}


                    <CardActions>
                        <Button size="small">Share</Button>
                        <Button size="small">Learn More</Button>
                    </CardActions>

                </Swiper>
            </Box>
        </Container >
    )
};

export default TrendBlogs;

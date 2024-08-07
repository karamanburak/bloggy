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
import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Typography } from "@mui/material";
import { FaChartBar } from "react-icons/fa";
import { MdOutlineVisibility } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


const TrendBlogs = () => {
    const { getTrendsData } = useBlogCall()
    const { trendings, blogs } = useSelector(state => state.blog)
    const navigate = useNavigate()

    useEffect(() => {
        getTrendsData()
    }, [])

    return (
        <Container maxWidth={'100vw'}>
            <Box>
                <Typography variant='h5' sx={{ color: "neutral.light" }}> <FaChartBar />  Trendings on Bloggy </Typography> <hr />
            </Box>
            <Box>
                <Swiper
                    style={{
                        "--swiper-pagination-bullet-inactive-color": "#999999",
                    }}
                    modules={[Autoplay, Pagination, Navigation, A11y]}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 2500 }}
                    breakpoints={{
                        300: {
                            slidesPerView: 1,
                            spaceBetween: 5,
                        },
                        576: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 15,
                        },
                        992: {
                            slidesPerView: 4,
                            spaceBetween: 18,
                        },
                        1400: {
                            slidesPerView: 6,
                            spaceBetween: 20,
                        },
                    }}
                >
                    {[...trendings].sort((a, b) => b.countOfVisitors - a.countOfVisitors).map((blog) => {
                        const { _id, content, image, title, userId, createdAt, likes, countOfVisitors, categoryId } = blog
                        return (
                            <SwiperSlide key={blog._id} style={{ display: "flex", justifyContent: "center", height: "320px" }}>
                                <Card sx={{ width: 210, height: 270, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                    <CardMedia
                                        component="img"
                                        height="120"
                                        image={image}
                                        alt={image}
                                    />
                                    <CardContent>
                                        <Typography sx={{ fontSize: ".8rem" }}>
                                            {new Date(createdAt).toLocaleString("de-DE")}
                                        </Typography>
                                        <hr />
                                        <Typography sx={{ textAlign: "center" }}>
                                            {title}
                                        </Typography>
                                    </CardContent>
                                    <Button
                                        onClick={() => navigate(`/blog/detail/${_id}`, { state: { _id, content, image, title, userId, createdAt, likes, countOfVisitors, categoryId } })}
                                        variant='contained' sx={{ cursor: "pointer", display: "flex", justifyContent: "space-between", backgroundColor: "neutral.dark" }}>
                                        <Typography>
                                            <MdOutlineVisibility />
                                            <sup>{countOfVisitors}</sup>
                                        </Typography>
                                        <Typography sx={{ textTransform: 'lowercase' }}>
                                            More...
                                        </Typography>
                                    </Button>
                                </Card>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </Box>
        </Container>
    )
};

export default TrendBlogs;
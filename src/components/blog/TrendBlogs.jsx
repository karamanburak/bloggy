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
import { Box, Button, CardMedia, Container, Typography } from "@mui/material";



const TrendBlogs = () => {
    const { getTrendsData } = useBlogCall()
    const { trendings, blogs } = useSelector(state => state.blog)
    const [trendBlogs, setTrendBlogs] = useState([]);
    console.log(trendings);



    useEffect(() => {
        getTrendsData()
    }, [])

    return (
        <Container maxWidth={'md'} sx={{ height: "300px" }}>
            <Swiper
                modules={[Navigation, Pagination, A11y, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                // className="w-[95%] h-[280px] max-w-[1600px] border-b border-gray-300"
                breakpoints={{
                    300: {
                        slidesPerView: 2,
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
                {trendings.map((blog, id) => {
                    const { image, title, countOfVisitors } = blog
                    return (
                        <SwiperSlide key={id}>
                            <Box>
                                <Box>
                                    <CardMedia
                                        component="img"
                                        height="194"
                                        image={image}
                                        alt={image}
                                    />
                                    <Typography sx={{ fontSize: "1rem" }}
                                    >
                                        {title}
                                    </Typography>
                                </Box>
                                <Button>
                                    More...
                                </Button>
                            </Box>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </Container>
    )
};

export default TrendBlogs;

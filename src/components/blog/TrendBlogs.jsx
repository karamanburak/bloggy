import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import useBlogCall from "../../hooks/useBlogCall";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { MdArrowOutward } from "react-icons/md";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MarkUnreadChatAltOutlinedIcon from "@mui/icons-material/MarkUnreadChatAltOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from "@mui/material";
import { FaChartBar } from "react-icons/fa";
import { MdOutlineVisibility } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const TrendBlogs = () => {
  const { getTrendsData } = useBlogCall();
  const { trendings } = useSelector((state) => state.blog);
  const navigate = useNavigate();

  useEffect(() => {
    getTrendsData();
  }, []);

  const topTrendingBlogs = [...trendings]
    .sort((a, b) => b.countOfVisitors - a.countOfVisitors)
    .slice(0, 10);

  return (
    <Container maxWidth={"100vw"}>
      <Box>
        <Typography
          variant="h5"
          sx={{
            color: "neutral.light",
            marginLeft: { xs: "4rem", md: "2.5rem" },
          }}
        >
          <FaChartBar /> Trendings on Bloggy
        </Typography>
        <hr />
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
          {topTrendingBlogs.map((blog) => {
            const {
              _id,
              content,
              image,
              title,
              userId,
              createdAt,
              likes,
              countOfVisitors,
              categoryId,
              comments,
            } = blog;

            return (
              <SwiperSlide
                key={blog._id}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: "320px",
                }}
              >
                <Card
                  sx={{
                    width: 220,
                    height: 280,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={image}
                    alt={image}
                    sx={{
                      borderBottom: "1px solid #ccc",
                      objectFit: "fill",
                    }}
                  />
                  <CardContent
                    sx={{
                      padding: "1rem",
                      // textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        // fontWeight: "bold",
                        // color: "#2D3748",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {categoryId.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        // color: "#4A5568",
                        height: "40px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        // whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      {title}
                    </Typography>
                  </CardContent>
                  <Button
                    onClick={() =>
                      navigate(`/blog/detail/${_id}`, {
                        state: {
                          _id,
                          content,
                          image,
                          title,
                          userId,
                          createdAt,
                          likes,
                          countOfVisitors,
                          categoryId,
                        },
                      })
                    }
                    variant="contained"
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#2D3748",
                      color: "#F7FAFC",
                      borderRadius: "0 0 8px 8px",
                      padding: "0.5rem 1rem",
                      "&:hover": {
                        backgroundColor: "#4A5568",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Typography>
                        <MdOutlineVisibility />
                        <sup>{countOfVisitors}</sup>
                      </Typography>
                      <Typography>
                        <FavoriteIcon style={{ fontSize: "1rem" }} />
                        <sup>{likes.length}</sup>
                      </Typography>
                      <Typography>
                        <MarkUnreadChatAltOutlinedIcon
                          style={{ fontSize: "1rem" }}
                        />
                        <sup>{comments.length}</sup>
                      </Typography>
                    </Box>
                    <Typography>
                      <MdArrowOutward />
                    </Typography>
                  </Button>
                </Card>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>
    </Container>
  );
};

export default TrendBlogs;

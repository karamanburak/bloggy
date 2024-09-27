import { Box, Container } from "@mui/material";
import homeVideo from "../assets/home-video.mp4";
import HomeCard from "../components/home/HomeCard";
import Footer from "../components/home/Footer";
import { useEffect } from "react";
import useBlogCall from "../hooks/useBlogCall";
import { useSelector } from "react-redux";
import "react-slideshow-image/dist/styles.css";
import loadingGif from "../assets/loading.gif";
import ShowsCard from "../components/home/ShowsCard";
import NewsCard from "../components/home/NewsCard";
import CustomSwiper from "../components/home/CustomSwiper";
import useCategoryCall from "../hooks/useCategoryCall";
import useNewsShowsCall from "../hooks/useNewsShowsCall";
import BooksCard from "../components/home/BooksCard";

const Dashboard = () => {
  const isDashboard = "/";
  const { getBlogData } = useBlogCall();
  const { getCategory } = useCategoryCall();
  const { getShowsData, getNewsData, getBooksData } = useNewsShowsCall();
  const { blogs, loading } = useSelector((state) => state.blog);
  const { news, shows, books } = useSelector((state) => state.newsShows);

  const topTrendingBlogs = [...blogs].sort(
    (a, b) => b.countOfVisitors - a.countOfVisitors
  );

  useEffect(() => {
    getBlogData("blogs");
    getCategory("categories");
    getNewsData();
    getShowsData();
    getBooksData();
  }, []);

  return (
    <Box sx={{ backgroundColor: "primary.main" }}>
      <video
        src={homeVideo}
        alt="home video"
        width="100%"
        autoPlay
        loop
        muted
        playsInline
        style={{ objectFit: "cover", minHeight: "100vh" }}
      />

      <Container maxWidth="xl">
        <Box>
          {loading ? (
            <img
              src={loadingGif}
              alt="loading..."
              height={300}
              style={{ display: "flex", margin: "auto" }}
            />
          ) : (
            <>
              <Box
                sx={{
                  padding: "2rem 0",
                  backgroundColor: "background.paper",
                  borderRadius: "10px",
                  boxShadow: 3,
                  mb: "2rem",
                }}
              >
                <CustomSwiper
                  items={topTrendingBlogs}
                  ItemComponent={HomeCard}
                />
                <CustomSwiper items={news} ItemComponent={NewsCard} />
                <CustomSwiper items={shows} ItemComponent={ShowsCard} />
                <CustomSwiper items={books} ItemComponent={BooksCard} />
              </Box>
            </>
          )}
        </Box>
      </Container>

      <Box sx={{ marginTop: "2rem" }}>
        <Footer isDashboard={isDashboard} />
      </Box>
    </Box>
  );
};

export default Dashboard;

import { Box, Container } from "@mui/material";
import homeVideo from "../assets/home-video.mp4";
import HomeCard from "../components/home/HomeCard";
import Footer from "../components/home/Footer";
import { useEffect } from "react";
import useBlogCall from "../hooks/useBlogCall";
import { useSelector } from "react-redux";
import { wellcomeMessage } from "../styles/globalStyles";
import "react-slideshow-image/dist/styles.css";
import loadingGif from "../assets/loading.gif";
import ShowsCard from "../components/home/ShowsCard";
import NewsCard from "../components/home/NewsCard";
import CustomSwiper from "../components/home/CustomSwiper";
import useCategoryCall from "../hooks/useCategoryCall";
import useNewsShowsCall from "../hooks/useNewsShowsCall";
import axios from "axios";

const Dashboard = () => {
  const isDashboard = "/";
  const { getBlogData } = useBlogCall();
  const { getCategory } = useCategoryCall();
  const { getShowsData, getNewsData } = useNewsShowsCall();
  const { blogs, loading } = useSelector((state) => state.blog);
  const { news, shows } = useSelector((state) => state.newsShows);

  const topTrendingBlogs = [...blogs].sort(
    (a, b) => b.countOfVisitors - a.countOfVisitors
  );

  useEffect(() => {
    getBlogData("blogs");
    getCategory("categories");
    getNewsData();
    getShowsData();
  }, []);

  return (
    <Box sx={{ backgroundColor: "primary.main" }}>
      <video
        src={homeVideo}
        alt="home video"
        width="100%"
        // height="720px"
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
              <Box sx={wellcomeMessage}>{/* <Quotes /> */}</Box>
              <CustomSwiper items={topTrendingBlogs} ItemComponent={HomeCard} />
              <CustomSwiper items={news} ItemComponent={NewsCard} />
              <CustomSwiper items={shows} ItemComponent={ShowsCard} />
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

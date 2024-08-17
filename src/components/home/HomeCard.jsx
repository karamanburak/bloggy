import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box, Container, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import PageHeader from "./PageHeader";
import { toastWarnNotify } from "../../helper/ToastNotify";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import useBlogCall from "../../hooks/useBlogCall";
import { MdArrowOutward } from "react-icons/md";

const HomeCard = ({
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
}) => {
  const { postLike } = useBlogCall();
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [readingTime, setReadingTime] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (currentUser && likes.includes(currentUser._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }

    const words = content.split(" ").length;
    const minutes = Math.ceil(words / 150);
    if (minutes >= 1) {
      setReadingTime(`${minutes} min read`);
    }
  }, [likes, currentUser]);

  const handleLike = () => {
    if (!currentUser) {
      toastWarnNotify("You must login to like the blog.");
      return;
    }

    postLike("blogs", _id);
  };

  const handleReadMore = () => {
    if (!currentUser) {
      toastWarnNotify("You must Login");
    } else {
      navigate(`/blog/detail/${_id}`, {
        state: {
          content,
          image,
          title,
          userId,
          createdAt,
          _id,
          likes,
          countOfVisitors,
          categoryId,
        },
      });
    }
  };

  const { image: userImage, firstName, lastName } = userId;

  return (
    <Container maxWidth="lg" sx={{ paddingBottom: "2rem" }}>
      <PageHeader text="Blogs" />
      <Card
        sx={{
          minHeight: "300px",
          flexDirection: { xs: "column", md: "row" },
          padding: "1rem",
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            order={{ xs: 2, md: 1 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              my: 3,
              p: 2,
              borderRadius: "12px",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <CardHeader
                sx={{
                  "& .MuiTypography-root": {
                    fontSize: 18,
                    fontWeight: "bold",
                  },
                }}
                avatar={
                  <Avatar aria-label="recipe">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt="user"
                        style={{ width: "100%" }}
                      />
                    ) : (
                      "A"
                    )}
                  </Avatar>
                }
                title={`${firstName} ${lastName}`}
                subheader={new Date(createdAt).toLocaleDateString("de-DE")}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  mt: 3,
                }}
              >
                {readingTime}
              </Typography>
            </Box>
            <CardContent>
              <Typography
                variant="body2"
                sx={{
                  maxHeight: "80px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                  lineHeight: 1.5,
                }}
              >
                {content}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <FavoriteIcon
                  sx={{ color: liked ? "red" : "", cursor: "pointer" }}
                  onClick={handleLike}
                />
                <Typography sx={{ ml: 1 }}>{likes?.length}</Typography>
                <ChatBubbleOutlineIcon sx={{ ml: 2 }} />
                <Typography sx={{ ml: 1 }}>{comments?.length}</Typography>
                <RemoveRedEyeIcon sx={{ ml: 2 }} />
                <Typography sx={{ ml: 1 }}>{countOfVisitors}</Typography>
              </Box>
            </CardContent>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Typography
                onClick={handleReadMore}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Read More <MdArrowOutward style={{ marginTop: ".2rem" }} />
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            order={{ xs: 1, md: 2 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardMedia
              component="img"
              height="374"
              image={image}
              alt="image"
              sx={{
                width: "100%",
                objectFit: "fill",
                borderRadius: "1rem",
              }}
            />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default HomeCard;

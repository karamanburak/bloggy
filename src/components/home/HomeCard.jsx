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
import { flex } from "../../styles/globalStyles";
import PageHeader from "./PageHeader";
import { toastWarnNotify } from "../../helper/ToastNotify";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
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
  const { blogs } = useSelector((state) => state.blog);
  const navigate = useNavigate();
  const [readingTime, setReadingTime] = useState(null);
  const [liked, setLiked] = useState(false);

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

  const { image: userImage, firstName, lastName } = userId;

  return (
    <Container
      maxWidth="xl"
      sx={{ backgroundColor: "neutral.dark", paddingBottom: "2rem" }}
    >
      <PageHeader text="Blogs" />
      <Card
        sx={{
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Grid container>
          <Grid
            item
            sm={12}
            md={6}
            order={{ xs: 2, md: 1 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              my: 3,
            }}
          >
            <Box
              sx={{
                display: {
                  xs: "block",
                  sm: "flex",
                  justifyContent: "space-between",
                },
              }}
            >
              <CardHeader
                sx={{
                  "& .MuiTypography-root": {
                    fontSize: 15,
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
                title={`${firstName} ${lastName} `}
                subheader={` ${new Date(createdAt).toLocaleDateString(
                  "de-DE"
                )}`}
              />
              <Box sx={{ display: "inline-block", mt: 3 }}>
                {readingTime && (
                  <Typography
                    variant="body2"
                    sx={{
                      padding: ".5rem",
                      borderRadius: "5px",
                      display: "inline-block",
                      marginLeft: "1rem",
                      marginRight: { xs: "0", sm: "1.5rem" },
                    }}
                  >
                    {readingTime}
                  </Typography>
                )}
              </Box>
            </Box>
            <CardContent>
              <Typography
                variant="body2"
                sx={{
                  maxHeight: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {content}
              </Typography>
            </CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  ...flex,
                  opacity: ".7",
                  gap: ".3rem",
                  marginLeft: "1rem",
                }}
              >
                <Typography>
                  <FavoriteIcon
                    sx={{
                      color: liked ? "red" : "",
                    }}
                    onClick={handleLike}
                  />
                  <sup>{likes?.length}</sup>
                </Typography>
                <ChatBubbleOutlineIcon />
                <Typography>
                  <sup>{comments?.length}</sup>
                </Typography>
                <RemoveRedEyeIcon />
                <Typography>
                  <sup>{countOfVisitors}</sup>
                </Typography>
              </Box>
              <Typography
                onClick={handleReadMore}
                sx={{
                  marginRight: "2rem",
                  marginBottom: ".5rem",
                }}
              >
                Read More <MdArrowOutward />
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            sm={12}
            md={6}
            order={{ xs: 1, md: 2 }}
            sx={{ margin: "auto", marginBottom: "1rem" }}
          >
            <CardMedia
              sx={{
                marginTop: "1rem",
                marginRight: "1rem",
                padding: "1rem",
                objectFit: "fill",
              }}
              component="img"
              height="274"
              image={image}
              alt="image"
            />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default HomeCard;

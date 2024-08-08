import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { flex } from "../../styles/globalStyles";
import { useState } from "react";
import { useSelector } from "react-redux";
import useBlogCall from "../../hooks/useBlogCall";
import { MdArrowOutward } from "react-icons/md";

const BlogCard = ({
  _id,
  content,
  image,
  title,
  userId,
  createdAt,
  likes,
  countOfVisitors,
  comments,
  categoryId,
}) => {
  const navigate = useNavigate();
  const [readingTime, setReadingTime] = useState(null);
  const { postLike, getLike } = useBlogCall();
  const { currentUser } = useSelector((state) => state.auth);
  const [liked, setLiked] = useState(false);

  const localDate = () => {
    if (createdAt) {
      const date = new Date(createdAt);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
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
  }, [likes, currentUser, getLike]);

  const handleLike = () => {
    postLike("blogs", _id);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        margin: "auto",
        // width: 500,
        height: 500,
      }}
    >
      {/* <CardMedia
        component="img"
        height="194"
        image={image}
        alt={image}
      /> */}
      <img
        src={image}
        alt={title}
        style={{ height: "250px", padding: "1rem" }}
      />
      <CardActions disableSpacing>
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
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
              onClick={handleLike}
            />
            <sup>{likes.length}</sup>
          </Typography>
          <ChatBubbleOutlineIcon sx={{ fontSize: "1.2rem" }} />
          <Typography>
            <sup>{comments.length}</sup>
          </Typography>
          <RemoveRedEyeIcon sx={{ fontSize: "1.2rem" }} />
          <Typography>
            <sup>{countOfVisitors}</sup>
          </Typography>
        </Box>
        <Box
          sx={{
            display: "inline-block",
            marginLeft: "auto",
            marginRight: "1rem",
            marginBottom: ".5rem",
          }}
        >
          {readingTime && (
            <Typography variant="body2">{readingTime}</Typography>
          )}
        </Box>
      </CardActions>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: "bold" }}>{title}</Typography>
          <Typography
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
                  readingTime,
                },
              })
            }
            sx={{
              marginBottom: "1rem",
              marginRight: "1rem",
              cursor: "pointer",
            }}
          >
            <MdArrowOutward />
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "3",
            WebkitBoxOrient: "vertical",
            // textAlign: "justify",
          }}
        >
          {content}
        </Typography>
      </CardContent>
      <CardHeader
        sx={{
          "& .MuiTypography-root": {
            fontSize: 15,
            fontWeight: "bold",
          },
        }}
        avatar={
          <Avatar aria-label="recipe">
            {_id ? (
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`}
                alt="image"
              />
            ) : (
              "R"
            )}
          </Avatar>
        }
        subheader={` ${localDate()}`}
      />
    </Card>
  );
};

export default BlogCard;

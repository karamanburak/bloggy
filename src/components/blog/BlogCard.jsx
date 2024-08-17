import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
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
  categoryId,
}) => {
  const navigate = useNavigate();
  const [readingTime, setReadingTime] = useState(null);
  const { getLike } = useBlogCall();
  const { currentUser } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category);
  const [liked, setLiked] = useState(false);
  // console.log(categories);

  const getCategoryName = () => {
    const category = categories.find((cat) => cat._id === categoryId._id);
    return category ? category.name : "Unknown Category";
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

  const { image: userImage, firstName, lastName } = userId;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        margin: "auto",
        height: 500,
      }}
    >
      <img
        src={image}
        alt={title}
        style={{ height: "250px", padding: "1rem" }}
      />
      <CardActions disableSpacing>
        <Box
          sx={{
            opacity: ".7",
            marginLeft: "1rem",
          }}
        >
          {getCategoryName()}
        </Box>
        <Box
          sx={{
            display: "inline-block",
            marginLeft: "auto",
            marginRight: "1rem",
          }}
        >
          {readingTime && (
            <Typography variant="body2">{readingTime}</Typography>
          )}
        </Box>
      </CardActions>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: "bold", marginBottom: ".5rem" }}>
            {title}
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
          }}
        >
          {content}
        </Typography>
      </CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <CardHeader
          sx={{
            "& .MuiTypography-root": {
              fontSize: 13,
              fontWeight: "bold",
            },
          }}
          avatar={
            <Avatar aria-label="recipe">
              {userImage ? (
                <img src={userImage} alt="user" style={{ width: "100%" }} />
              ) : (
                firstName.charAt(0).toUpperCase()
              )}
            </Avatar>
          }
          title={`${firstName} ${lastName} `}
          subheader={` ${new Date(createdAt).toLocaleDateString("de-DE")}`}
        />
        <Box>
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
              marginTop: "1rem",
              marginRight: "2rem",
              cursor: "pointer",
            }}
          >
            <MdArrowOutward />
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default BlogCard;

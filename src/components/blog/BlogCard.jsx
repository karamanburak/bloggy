import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { flex } from '../../styles/globalStyles';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import useBlogCall from '../../hooks/useBlogCall';
import useCategoryCall from '../../hooks/useCategoryCall';
// import UpdateModal from './UpdateModal';




const BlogCard = ({ _id, content, image, title, userId, createdAt, likes, countOfVisitors, comments, categoryId }) => {
  const navigate = useNavigate()
  const [readingTime, setReadingTime] = useState(null);
  const { postLike, getLike } = useBlogCall()
  const { currentUser } = useSelector(state => state.auth)
  const [liked, setLiked] = useState(false);

  const localDate = () => {
    if (createdAt) {
      return new Date(createdAt).toLocaleString("de-DE")
    }
  }

  useEffect(() => {
    if (currentUser && likes.includes(currentUser._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }

    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 150);
    if (minutes >= 1) {
      setReadingTime(`${minutes} min read`);
    }


  }, [likes, currentUser, getLike]);



  const handleLike = () => {
    postLike("blogs", _id);
  }

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        margin: "auto",
        // width: 500,
        height: 600,
      }}
    >
      <CardMedia
        component="img"
        height="194"
        image={image}
        alt={image}
      />

      <CardContent>
        <Typography sx={{ color: "indianred", fontWeight: "bold", textAlign: "center", textTransform: "uppercase" }}>{title}</Typography>
        <Typography variant="body2"
          sx={{
            // maxHeight: "100px",
            overflow: "hidden",
            extAlign: "justify",
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '4',
            WebkitBoxOrient: 'vertical',
            textAlign:"justify"

          }}>
          {content}
        </Typography>
      </CardContent>
      <CardHeader
        sx={{
          '& .MuiTypography-root': {
            fontSize: 15,
            fontWeight: "bold"
          }
        }}
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {_id ? <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`} alt="image" /> : "R"}
          </Avatar>
        }
        subheader={`Published Date: ${localDate()}`}
      />
      <CardActions disableSpacing>
        <Box sx={{ ...flex, opacity: ".7", gap: ".3rem", marginLeft: "1rem" }}>
          <Typography >
            <FavoriteIcon
              sx={{
                color: liked ? "red" : "",
                cursor: "pointer"
              }}
              onClick={handleLike}
            />
            <sup>{likes.length}</sup>
          </Typography>
          <ChatBubbleOutlineIcon />
          <Typography>
            <sup>{comments.length}</sup>
          </Typography>
          <RemoveRedEyeIcon />
          <Typography>
            <sup>{countOfVisitors}</sup>
          </Typography>
        </Box>
        <Box sx={{ display: "inline-block", marginLeft: "auto", marginRight: "1rem" }}>
          {readingTime && (
            <Typography variant="body2" sx={{ backgroundColor: "neutral.dark", padding: ".5rem", borderRadius: "5px" }}>
              {readingTime}
            </Typography>
          )}
        </Box>
      </CardActions>
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginRight: "1rem" }}>
        <Button onClick={() => navigate(`/blog/detail/${_id}`, { state: { _id, content, image, title, userId, createdAt, likes, countOfVisitors, categoryId } })} variant="contained" sx={{ marginBottom: "1rem", backgroundColor: "primary.light" }} >
          Read More
        </Button>
      </Box>
      {/* <UpdateModal /> */}
    </Card>

  )
};

export default BlogCard;

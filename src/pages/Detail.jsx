import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { Box, Button, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import useBlogCall from "../hooks/useBlogCall";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { flex } from '../styles/globalStyles'
import { useState } from 'react';
import CommentForm from '../components/blog/CommentForm';



const Detail = () => {
    const navigate = useNavigate()
    const { state } = useLocation()
    const { content, image, title, createdAt, userId, _id, likes, countOfVisitors } = state;
    const { getLike, getDetailBlog } = useBlogCall()
    const { currentUser } = useSelector(state => state.auth)
    const { comments } = useSelector(state => state.blog)
    console.log(comments);
    const [liked, setLiked] = useState(false);



    useEffect(() => {
        getDetailBlog("blogs", _id)
        if (currentUser && likes.includes(currentUser._id)) {
            setLiked(true);
        } else {
            setLiked(false);
        }

    }, [likes, currentUser]);



    const localDate = () => {
        if (createdAt) {
            return new Date(createdAt).toLocaleString("de-DE")
        }
    }

    const handleLike = async () => {
        await getLike("blogs", _id);

    }

    return (
        <Card sx={{backgroundColor: "primary.dark", padding: "2rem", minHeight: "90vh"}}>
            <Grid container sx={{...flex, gap:4}}>
                <Grid item xs={12} lg={4}>
                <Button onClick={() => navigate(-1)} variant="contained" sx={{ backgroundColor: "primary.light", mb: 5 }} >
                    Go BACK
                </Button>
                    <CardMedia
                        sx={{
                            margin: "auto",
                            borderRadius: "5px",
                            objectFit:"contain"
                        }}
                        component="img"
                        height="400"
                        image={image}
                        alt="image"
                    />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <CardHeader
                        sx={{
                            color: "aqua",
                            // mt: 10,
                            '& .MuiTypography-root': {
                                fontSize: 18,
                                fontWeight: "bold"
                            }
                        }}
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                {userId ? <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`} alt="image" /> : "R"}
                            </Avatar>
                        }
                        title={title}
                        subheader={`Published Date: ${localDate()}`}
                    />
                    <CardContent>
                        <Typography variant="body2" sx={{ textAlign: "justify" }} >
                            {content}
                        </Typography>
                    </CardContent>
                    <Box sx={{ ...flex, opacity: ".7", gap: ".5rem", justifyContent: "end" }}>
                        <Typography>
                            <FavoriteIcon
                                sx={{
                                    color: liked ? "red" : "",
                                    cursor: "pointer"
                                }}
                                onClick={() => getLike("blogs", _id)}
                            />
                            <sup>{likes.length}</sup>
                        </Typography>
                        <ChatBubbleOutlineIcon />
                               <Typography>
                            <sup>{comments?.comments?.length || 0}</sup>
                        </Typography>
                        <RemoveRedEyeIcon />
                        <Typography>
                            <sup>{countOfVisitors}</sup>
                        </Typography>
                    </Box>
                </Grid>
                <Box sx={{margin:"auto"}}>
                <CardContent CardContent sx={{ margin: "auto" }}>
                    <Typography sx={{ textAlign: "center", my: 5, color: "secondary.main" }}>COMMENTS</Typography>
                        <CommentForm />
                    {comments?.comments?.map(comment => {
                        if (comment.blogId === _id) {
                            return (
                                <Box key={comment._id} sx={{ my: 10, backgroundColor: "secondary.main", padding: "2rem", borderRadius: "1rem" }}>
                                    <Typography>{comment.comment}</Typography>
                                </Box>
                            );
                        }
                    })}

                </CardContent>
            </Box>
            </Grid>
        </Card >

    )
};

export default Detail;

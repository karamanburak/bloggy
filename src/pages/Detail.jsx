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
import { commentsStyle, flex } from '../styles/globalStyles'
import { useState } from 'react';
import CommentForm from '../components/blog/CommentForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



const Detail = () => {
    const navigate = useNavigate()
    const { state } = useLocation()
    const { content, image, title, createdAt, userId, _id, likes, countOfVisitors } = state;
    const {  getDetailBlog } = useBlogCall()
    const { currentUser } = useSelector(state => state.auth)
    const { blogs, comments } = useSelector(state => state.blog)
    const [commentText, setCommentText] = useState("")

    
    console.log(currentUser);
    console.log(blogs);


    useEffect(() => {
        getDetailBlog("blogs", _id)

    }, [currentUser,commentText]);


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("de-DE");
    };

    const handleCommentSubmit = () => {
        getDetailBlog("blogs", _id);

    };


    return (
        <Card sx={{ backgroundColor: "primary.dark", padding: "2rem", minHeight: "90vh" }}>
                    <Button onClick={() => navigate(-1)} variant="contained" sx={{ backgroundColor: "primary.light", mb: 5,display:flex, gap:1}} >
                <ArrowBackIcon/>   Go BACK
                    </Button>
            <Grid container sx={{ ...flex, gap: 4 }}>
                <Grid item xs={12} lg={4}>
                    <CardMedia
                        sx={{
                            margin: "auto",
                            borderRadius: "5px",
                            objectFit: "contain"
                        }}
                        component="img"
                        height="400"
                        image={image}
                        alt="image"
                    />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Box sx={{...flex, justifyContent:"space-between"}}>
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
                            subheader={`Published Date: ${formatDate(createdAt)}`}
                        />
                 
                    </Box>
                    <Typography variant="body2" sx={{ textAlign: "justify" }} >
                        {content}
                    </Typography>
                    <Box sx={{ ...flex, opacity: ".7", gap: ".5rem", justifyContent: "space-between", m:4}}>
                        <Box sx={{ display: "flex", gap: 2, marginLeft:"-2rem" }}>
                            <Button variant='contained' sx={{ backgroundColor: "cornflowerblue" }}>Update Blog</Button>
                            <Button variant='contained' sx={{ backgroundColor: "red" }}>Delete Blog</Button>
                        </Box>
                        <Box sx={{ ...flex, opacity: ".7", gap: ".5rem", justifyContent: "space-between"}} >
                            <Typography >
                                <FavoriteIcon/>
                                <sup>{likes.length}</sup>
                            </Typography>
                        <ChatBubbleOutlineIcon />
                        <Typography>
                            <sup>{comments?.length || 0}</sup>
                        </Typography>
                        <RemoveRedEyeIcon />
                        <Typography>
                            <sup>{countOfVisitors}</sup>
                        </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Box sx={{ margin: "auto", padding:"2rem", backgroundColor:"secondary.main", borderRadius:"10px"}}>
                    <Typography sx={commentsStyle}>COMMENTS</Typography>
                    <CardContent sx={{ margin: "auto", width: "80vw" }}>
                        <Box sx={{ marginTop: "4rem" }}>
                            <CommentForm blogId={_id} onCommentSubmit={handleCommentSubmit} commentText={commentText} setCommentText={setCommentText}/>
                        </Box>
                        {comments?.length > 0 ? (
                            comments.map(comment => {
                                if (comment.blogId === _id) {
                                    return (
                                        <Box key={comment._id} sx={{ my: 10, backgroundColor: "primary.main", padding: "2rem", borderRadius: "1rem", maxWidth: "90vw" }}>
                                            <CardHeader
                                                sx={{
                                                    color: "seagreen",
                                                    '& .MuiTypography-root': {
                                                        fontSize: 15,
                                                        fontWeight: "bold",
                                                    }
                                                }}
                                                avatar={
                                                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                                        <img key={comment._id} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userId.firstName}`} alt="image" />
                                                    </Avatar>
                                                }
                                                title={`${comment.userId.firstName} ${comment.userId.lastName}`}
                                                subheader={`Published Date: ${formatDate(comment.createdAt)}`}
                                            />
                                            <Typography>{comment.comment}</Typography>
                                        </Box>
                                    );
                                }
                                return null;
                            })
                        ) : (
                            <Typography sx={{ textAlign: "center", mt: 5, fontSize: "2rem" }}>There are no comments yet...</Typography>
                        )}
                    </CardContent>
                </Box>
            </Grid>
        </Card >

    )
};

export default Detail;

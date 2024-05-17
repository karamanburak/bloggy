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
import PageHeader from "../components/home/PageHeader";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { flex } from '../styles/globalStyles'
import { useState } from 'react';



const Detail = () => {
    const navigate = useNavigate()
    const { state } = useLocation()
    const { content, image, title, createdAt, userId,_id,likes,countOfVisitors } = state;
    const { getComments,getLike } = useBlogCall()
    const { currentUser } = useSelector(state => state.auth)
    console.log(currentUser);
    
    const {comments} = useSelector(state=> state.blog)
    console.log(comments);
    const [liked, setLiked] = useState(false);

        

    useEffect(() => {
        getComments("comments", userId)
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

    const handleLike = () => {
        getLike("blogs", _id);
    }


    return (
        <Card sx={{
            backgroundColor: "primary.dark", padding: "2rem", minHeight: "90vh"
        }}>
            <Grid container>
                <Grid item sx={{ margin: "auto" }}>
                    <CardMedia
                        sx={{ borderRadius: "5px" }}
                        component="img"
                        height="400"
                        image={image}
                        alt="image"
                    />
                </Grid>
                <Grid item sx={{
                    margin: "auto",
                    width: {
                        xs: "100%",
                        sm: "80%",
                        lg: "50vw"
                    },

                }}>
                    <CardHeader
                        sx={{
                            color: "aqua",
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
                        <CardContent>
                        
                        <PageHeader text="Comments"/>
                            {comments.map(comment => {
                                if (comment.blogId === _id) {
                                    return (
                                        <Box key={comment._id}>
                                            <Typography>{comment.comment}</Typography>
                                        </Box>
                                    );
                                }
                            })}
                        </CardContent>

                    </CardContent>
                    <Box sx={{ ...flex, opacity: ".7", gap: ".5rem", justifyContent:"end" }}>
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
                    <Button onClick={() => navigate(-1)} variant="contained" sx={{ marginLeft: "1rem", marginBottom: "1rem", backgroundColor: "primary.light" }} >
                        Go BACK
                    </Button>
                </Grid>
            </Grid>
        </Card>

    )
};

export default Detail;

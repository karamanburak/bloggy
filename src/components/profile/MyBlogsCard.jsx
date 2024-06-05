import React from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { Box, Button, Container } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { flex } from '../../styles/globalStyles';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";




const MyBlogsCard = ({ _id, content, image, title, userId, createdAt, likes, comments, countOfVisitors, categoryId }) => {
    const navigate = useNavigate()
    const [readingTime, setReadingTime] = useState(null);




    const localDate = () => {
        if (createdAt) {
            return new Date(createdAt).toLocaleString("de-DE")
        }
    }

    const calcReadingTime = () => {
        const words = content.split(' ').length;
        const minutes = Math.ceil(words / 150);
        if (minutes >= 1) {
            setReadingTime(`${minutes} min read`);
        }
    }

    useEffect(() => {
        calcReadingTime()
    }, [])


    return (
        <Container sx={{ 
            paddingBottom: "2rem",
            textAlign:"justify", 
            width: {xs:"120%", sm:"80%"}, 
            marginLeft:{xs:"-2rem", sm:"auto"},
            }}>
            <Card sx={{ borderRadius: "10px"}}>
                <CardMedia
                    sx={{
                        marginTop: "1rem",
                        padding: "1rem",
                        borderRadius: "1.5rem",
                    }}
                    component="img"
                    height="214"
                    image={image}
                    alt="image"
                />

                <CardHeader
                    sx={{
                        color: "seagreen",
                        '& .MuiTypography-root': {
                            fontSize: 15,
                            fontWeight: "bold"
                        }

                    }}
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="image">
                            {_id ? <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`} alt="image" /> : "R"}
                        </Avatar>
                    }
                    title={title}
                    subheader={`Published Date: ${localDate()}`}
                />
                <Box sx={{ display: "inline-block", marginLeft: "1rem" }}>
                    {readingTime && (
                        <Typography variant="body2" sx={{marginLeft:"3rem", backgroundColor: "primary.light", padding: ".5rem", borderRadius: "5px" }}>
                            {readingTime}
                        </Typography>
                    )}
                </Box>
                <CardContent>
                    <Typography variant="body2" sx={{ maxHeight: "100px", overflow: "hidden" }} >
                        {content}
                    </Typography>
                </CardContent>
                <Box sx={{ display: {xs:"block", sm:"flex"},justifyContent: "space-between" }}>
                    <Box sx={{ ...flex, opacity: ".7", gap: ".3rem", marginLeft:"1rem"}}>
                        <Typography >
                            <FavoriteIcon />
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
                    <Button onClick={() => navigate(`/blog/detail/${_id}`, { state: { content, image, title, userId, createdAt, likes, _id, categoryId, countOfVisitors } })} variant="contained" sx={{ marginLeft: { xs: "3.5rem" , sm:"1rem"} , marginRight: "1rem", marginBottom: "1rem", backgroundColor: "primary.light" }} >
                        Read More
                    </Button>
                </Box>
            </Card>
        </Container>
    )
};

export default MyBlogsCard;

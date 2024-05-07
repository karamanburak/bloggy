

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



const MyBlogsCard = ({ _id, content, image, title, userId, createdAt, likes, comments, countOfVisitors }) => {
    console.log(_id, content, image, title, userId, createdAt, likes, comments);
    const navigate = useNavigate()


    const localDate = () => {
        if (createdAt) {
            return new Date(createdAt).toLocaleString("de-DE")
        }
    }

    return (
        <Container maxWidth="xl" sx={{ ...flex, paddingBottom: "2rem" }}>
            <Card sx={{ borderRadius: "10px" }}>
                <CardMedia
                    sx={{
                        marginTop: "1rem",
                        marginRight: "1rem",
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
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                            R
                        </Avatar>
                    }
                    title={title}
                    subheader={`Published Date: ${localDate()}`}
                />
                <CardContent>
                    <Typography variant="body2" sx={{ maxHeight: "100px", overflow: "hidden" }} >
                        {content}
                    </Typography>
                </CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
                    <Box sx={{ ...flex, opacity: ".7", gap: ".3rem", marginLeft: "1rem" }}>
                        <FavoriteIcon />
                        <Typography>
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
                    <Button onClick={() => navigate(`/blog/detail/${_id}`, { state: { content, image, title, userId, createdAt, likes } })} variant="contained" sx={{ marginRight: "1rem", marginBottom: "1rem", backgroundColor: "primary.light" }} >
                        Read More
                    </Button>
                </Box>
            </Card>
        </Container>
    )
};

export default MyBlogsCard;

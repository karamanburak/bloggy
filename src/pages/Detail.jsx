import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditNoteIcon from '@mui/icons-material/EditNote';
import useCategoryCall from '../hooks/useCategoryCall';


const Detail = () => {
    const navigate = useNavigate()
    const { state } = useLocation()
    const { content, image, createdAt, userId, title, _id, likes, categoryId,countOfVisitors } = state;
    const { getCommentsDetail, deleteBlog, getBlogDetail } = useBlogCall()
    const { currentUser } = useSelector(state => state.auth)
    const { comments, blog} = useSelector(state => state.blog)    
    const { categories } = useSelector(state => state.category)
    const { getCategory } = useCategoryCall();
    const [open, setOpen] = useState(false);




    const handleDelete = () => {
        setOpen(false);
        deleteBlog("blogs", _id)
        navigate(-1)
    };


    useEffect(() => {
        if (!categories.length) {
            getCategory('categories');
        }
        // getBlogDetail("blogs", _id)

    }, []);


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("de-DE");
    };


    const isCurrentUserOwner = currentUser && userId === currentUser._id;

    const getCategoryName = () => {
        const category = categories.find(cat => cat._id === categoryId);
        return category ? category.name : "Unknown Category";
    };



    return (
        <Card sx={{ backgroundColor: "primary.main", padding: "2rem", margin: "auto" }}>
            <Button onClick={() => navigate(-1)} variant="contained" sx={{ backgroundColor: "primary.light", mb: 5, display: flex, gap: 1 }} >
                <ArrowBackIcon /> GO BACK
            </Button>
            <Box sx={{ width: { xs: "80vw", md: "50vw" }, margin: "auto" }}>
                <CardMedia
                    sx={{
                        margin: "auto",
                        borderRadius: "5px",
                        objectFit: "cover",

                    }}
                    component="img"
                    height="400"
                    image={image}
                    alt="image"
                />
                <Box sx={{ ...flex,  justifyContent:"space-between", marginLeft: ".7rem" }}>
                    <CardHeader
                        sx={{
                            color: "indianred",
                            mt: 6,
                            '& .MuiTypography-root': {
                                fontSize: 18,
                                fontWeight: "bold"
                            }
                        }}
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                {blog ? <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.firstName}`} alt="image" /> : "R"}
                            </Avatar>
                        }
                        title={blog ? `${blog.firstName} ${blog.lastName}` : title}
                        subheader={`Published Date: ${formatDate(createdAt)}`}
                    />
                    <Typography variant="subtitle1" sx={{ backgroundColor: "indianred", color: "neutral.light", marginLeft: "1.5rem", marginTop: "2rem", display: "inline-block", padding: ".5rem", borderRadius: "7px", textAlign:"center" }}>
                        <b>Category:</b> {getCategoryName()}
                    </Typography>
                </Box>
                <Typography variant='h6' component="h1" sx={{ textTransform: "uppercase", fontWeight: "bold", marginLeft: "1.5rem", color: "indianred" }}>{title}</Typography>
                <Typography variant="body2" sx={{ textAlign: "justify", marginLeft: "1.5rem", fontSize: "1.1rem" }} >
                    {content}
                </Typography>
                <Box sx={{display:{xs: "block", lg:"flex"}, opacity: ".7",  justifyContent: "space-between", m: 4 }}>
                    <Box sx={{ display:"flex", opacity: ".7", gap: ".5rem",  mt:2 }} >
                        <Typography >
                            <FavoriteIcon />
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
                    {isCurrentUserOwner && (
                        <Box sx={{ display: "flex", gap: 2, marginLeft: "2-1em",mt:2}}>
                            <Button variant='contained' sx={{ backgroundColor: "cornflowerblue" }}> <EditNoteIcon />Edit Blog</Button>
                            <Button
                                variant='contained'
                                sx={{ backgroundColor: "red" }}
                                onClick={() => setOpen(true)}
                            >
                                <DeleteForeverIcon /> Delete Blog
                            </Button>
                            <Dialog open={open} onClose={() => setOpen(false)}>
                                <DialogTitle>Confirm Delete</DialogTitle>
                                <DialogContent>
                                    Are you sure you want to delete this blog post?
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpen(false)} sx={{ color: 'gray' }}>Cancel</Button>
                                    <Button onClick={handleDelete} sx={{ color: 'red' }}>Delete</Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    )}
                </Box>
                <Box>
                    <CardContent sx={{ margin: "auto", marginLeft: "-2rem" }}>
                        <CommentForm blogId={_id}  id={_id} />
                        {comments?.length > 0 ? (
                            comments.map(comment => {
                                if (comment.blogId === _id) {
                                    return (
                                        <Box key={comment._id} sx={{ margin: "auto", width: { xs: "80vw", sm: "50vw" }, backgroundColor: "primary.light", padding: "2rem", borderRadius: "1rem", my: 6 }}>
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
                                            <Typography sx={{ marginLeft: "1.2rem" }}>{comment.comment}</Typography>
                                        </Box>
                                    )
                                } else {
                                    return null;
                                }
                            })
                        ) : (
                            <Typography sx={{ textAlign: "center", mt: 5, fontSize: "2rem" }}>There are no comments yet...</Typography>
                        )}
                    </CardContent>
                </Box>
            </Box>
        </Card >
    )
};

export default Detail;

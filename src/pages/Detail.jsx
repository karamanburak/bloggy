import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { Box, Divider, Grid, IconButton, Menu, MenuItem } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import useBlogCall from "../hooks/useBlogCall";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MarkUnreadChatAltOutlinedIcon from "@mui/icons-material/MarkUnreadChatAltOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { flex } from "../styles/globalStyles";
import { useState } from "react";
import CommentForm from "../components/blog/CommentForm";
import useCategoryCall from "../hooks/useCategoryCall";
import SocialShare from "../components/blog/SocialShare";
import { BsThreeDots } from "react-icons/bs";
import DeleteBlog from "../components/blog/DeleteBlog";
import { MdEditNote } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import EditBlogModal from "../components/blog/EditBlogModal";

const Detail = () => {
  const { state } = useLocation();
  const {
    content,
    image,
    createdAt,
    userId,
    title,
    _id,
    likes: initialLikes,
    categoryId,
    countOfVisitors,
  } = state;
  const { getBlogDetail, getBlogData } = useBlogCall();
  const { currentUser } = useSelector((state) => state.auth);
  const { blog } = useSelector((state) => state.blog);
  const { categories } = useSelector((state) => state.category);
  const { getCategory } = useCategoryCall();
  const { postLike } = useBlogCall();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLikes.includes(currentUser._id));
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [initialState, setInitialState] = useState({
    title: title,
    content: content,
    image: image,
  });

  const handleToggleComments = () => {
    setShowComments((prevState) => !prevState);
  };

  useEffect(() => {
    if (likes.includes(currentUser._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    if (!categories.length) {
      getCategory("categories");
    }
    getBlogDetail("blogs", _id);
  }, []);

  const handleLike = () => {
    postLike("blogs", _id);
    setLiked(!liked);
    setLikes((prevLikes) =>
      liked
        ? prevLikes.filter((id) => id !== currentUser._id)
        : [...prevLikes, currentUser._id]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("de-DE");
  };

  const isCurrentUserOwner = currentUser && userId === currentUser._id;

  const getCategoryName = () => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setOpenEditModal(true);
    handleMenuClose();
  };

  const handleEditClose = () => {
    setOpenEditModal(false);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/`;
    navigator.clipboard.writeText(link);
    handleMenuClose();
  };

  return (
    <Card
      sx={{
        backgroundColor: "primary.main",
        padding: "2rem",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container spacing={2} mt={9} sx={{ flex }}>
        <Grid
          item
          xs={12}
          md={9}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: { xs: "80vw", md: "50vw" } }}>
            <Box
              sx={{
                marginY: "2rem",
                fontSize: "1.2rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography variant="p">
                <Typography
                  variant="span"
                  sx={{ color: "gray", marginRight: ".5rem" }}
                >
                  Written By{" "}
                </Typography>{" "}
                {blog
                  ? `${blog?.userId?.firstName} ${blog?.userId?.lastName}`
                  : title}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <Typography>{`${formatDate(createdAt)}`}</Typography>
              <Typography>{getCategoryName()}</Typography>
            </Box>
          </Box>

          <Box sx={{ width: { xs: "80vw", md: "50vw" }, margin: "auto" }}>
            <CardMedia
              sx={{
                margin: "auto",
                borderRadius: "20px",
                objectFit: "cover",
              }}
              component="img"
              height="400"
              image={image}
              alt="image"
            />
            <Box
              sx={{
                display: "flex",
                gap: ".5rem",
                mt: 2,
                justifyContent: { xs: "center", lg: "flex-end" },
              }}
            >
              <SocialShare {...state} />
            </Box>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                textAlign: "center",
                marginTop: "2rem",
                marginBottom: "1rem",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: "justify",
                marginLeft: "1.5rem",
                fontSize: "1.1rem",
                color: "gray",
              }}
            >
              {content}
            </Typography>
            <Box
              sx={{
                display: "flex",
                opacity: ".7",
                justifyContent: "space-between",
                m: 4,
                cursor: "pointer",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: ".5rem",
                  mt: 2,
                }}
              >
                <Typography>
                  <FavoriteIcon
                    sx={{
                      color: liked ? "red" : "",
                      cursor: "pointer",
                    }}
                    onClick={handleLike}
                  />
                  <sup>{likes.length}</sup>
                </Typography>
                <Typography onClick={handleToggleComments}>
                  {showComments ? (
                    <ChatBubbleOutlineIcon />
                  ) : (
                    <MarkUnreadChatAltOutlinedIcon />
                  )}
                </Typography>
                <Typography>
                  <sup>{blog?.comments?.length || 0}</sup>
                </Typography>
                <RemoveRedEyeIcon />
                <Typography>
                  <sup>{countOfVisitors + 1}</sup>
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={handleMenuOpen}>
                  <BsThreeDots />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem key="copy" onClick={handleCopyLink}>
                    <IoIosLink style={{ marginRight: ".5rem" }} /> Copy Link
                  </MenuItem>
                  {isCurrentUserOwner && [
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Divider />
                      <MenuItem key="edit" onClick={handleEditClick}>
                        <MdEditNote style={{ marginRight: ".5rem" }} /> Edit
                        Blog
                      </MenuItem>
                      <MenuItem key="delete">
                        <DeleteBlog id={_id} />
                      </MenuItem>
                    </Box>,
                  ]}
                </Menu>
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <CardContent sx={{ margin: "auto", marginLeft: "-1rem" }}>
                <CommentForm blogId={_id} />
                {showComments &&
                  (blog?.comments?.length > 0 ? (
                    blog.comments.map((comment) => {
                      if (comment.blogId === _id) {
                        return (
                          <Box
                            key={comment._id}
                            sx={{
                              margin: "auto",
                              width: { xs: "80vw", sm: "50vw" },
                              backgroundColor: "primary.light",
                              padding: "1rem",
                              borderRadius: "1rem",
                              my: 6,
                              border: "2px solid gray",
                            }}
                          >
                            <CardHeader
                              sx={{
                                color: "seagreen",
                                "& .MuiTypography-root": {
                                  fontSize: 15,
                                  fontWeight: "bold",
                                },
                              }}
                              avatar={
                                <Avatar
                                  sx={{ bgcolor: red[500] }}
                                  aria-label="recipe"
                                >
                                  <img
                                    key={comment._id}
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userId.firstName}`}
                                    alt="image"
                                  />
                                </Avatar>
                              }
                              title={`${comment.userId.firstName} ${comment.userId.lastName}`}
                              subheader={`Published Date: ${formatDate(
                                comment.createdAt
                              )}`}
                            />
                            <Typography sx={{ marginLeft: "1.2rem" }}>
                              {comment.comment}
                            </Typography>
                          </Box>
                        );
                      } else {
                        return null;
                      }
                    })
                  ) : (
                    <Typography
                      sx={{ textAlign: "center", mt: 5, fontSize: "2rem" }}
                    >
                      There are no comments yet...
                    </Typography>
                  ))}
              </CardContent>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {openEditModal && (
        <EditBlogModal
          open={openEditModal}
          onClose={handleEditClose}
          blog={state}
          initialState={initialState} // Pass the blog data to the EditBlog component
        />
      )}
    </Card>
  );
};

export default Detail;

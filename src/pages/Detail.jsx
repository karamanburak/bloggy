import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box, Divider, Grid, IconButton, Menu, MenuItem } from "@mui/material";
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
import CustomCardHeader from "../components/blog/CustomCardHeader ";
import { useParams } from "react-router-dom";
import loadingGif from "../assets/loading.gif";
import { formatNumber } from "../helper/formatNumber";
import { toastWarnNotify } from "../helper/ToastNotify";

const Detail = () => {
  const { id } = useParams();
  const { getBlogDetail, postLike } = useBlogCall();
  const { currentUser } = useSelector((state) => state.auth);
  const { blog, loading } = useSelector((state) => state.blog);
  const { categories } = useSelector((state) => state.category);
  const { getCategory } = useCategoryCall();
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [initialState, setInitialState] = useState();

  const handleToggleComments = () => {
    setShowComments((prevState) => !prevState);
  };

  useEffect(() => {
    if (!categories.length) {
      getCategory();
    }
    if (id) {
      getBlogDetail(id);
    }
  }, []);

  useEffect(() => {
    if (blog) {
      setLikes(blog.likes || []);
      setLiked((blog.likes || []).includes(currentUser?._id));
      setInitialState({
        title: blog?.title,
        content: blog?.content,
        image: blog?.image,
      });
    }
  }, []);

  const handleLike = () => {
    if (!currentUser) {
      toastWarnNotify(
        "You need to be logged in to like this blog. Please sign in or register."
      );
      return;
    }
    postLike("blogs", id);
    setLiked(!liked);
    setLikes((prevLikes) =>
      liked
        ? prevLikes.filter((userId) => userId !== currentUser._id)
        : [...prevLikes, currentUser._id]
    );
  };
  const isCurrentUserOwner =
    currentUser && blog?.userId?._id === currentUser?._id;

  const getCategoryName = () => {
    const category = categories.find(
      (cat) => cat._id === blog?.categoryId?._id
    );
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
    const link = `${window.location.origin}/blog/detail/${id}`;
    navigator.clipboard.writeText(link);
    handleMenuClose();
  };

  return (
    <>
      {loading ? (
        <img
          src={loadingGif}
          alt="loading..."
          // height={300}
          style={{
            display: "flex",
            margin: "auto",
          }}
        />
      ) : (
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
                    display: "flex",
                    justifyContent: "space-between",
                    gap: { xs: "2rem", sm: "0" },
                  }}
                >
                  <CustomCardHeader
                    {...blog?.userId}
                    createdAt={blog?.createdAt}
                  />
                  <Box>
                    <Typography
                      sx={{
                        marginTop: { xs: "1.5rem", sm: "2rem" },
                        fontWeight: { sm: "bold" },
                        marginRight: "1rem",
                      }}
                    >
                      {getCategoryName()}
                    </Typography>
                  </Box>
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
                  image={blog?.image}
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
                  <SocialShare {...blog} />
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
                  {blog?.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "justify",
                    marginLeft: "1.5rem",
                    fontSize: "1.1rem",
                    // color: "gray",
                    opacity: ".8",
                  }}
                >
                  {blog?.content}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    opacity: ".7",
                    justifyContent: "space-between",
                    m: 4,
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
                      <sup>{formatNumber(likes.length)}</sup>
                    </Typography>

                    <Typography
                      sx={{
                        cursor: "pointer",
                      }}
                      onClick={handleToggleComments}
                    >
                      {showComments ? (
                        <ChatBubbleOutlineIcon />
                      ) : (
                        <MarkUnreadChatAltOutlinedIcon />
                      )}
                    </Typography>
                    <Typography>
                      <sup>{formatNumber(blog?.comments?.length)}</sup>
                    </Typography>
                    <RemoveRedEyeIcon />
                    <Typography>
                      <sup>{formatNumber(blog?.countOfVisitors)}</sup>
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
                      <MenuItem key="copy-link" onClick={handleCopyLink}>
                        <IoIosLink style={{ marginRight: ".5rem" }} /> Copy Link
                      </MenuItem>
                      {isCurrentUserOwner && [
                        <Box
                          key="owner-actions"
                          sx={{ display: "flex", flexDirection: "column" }}
                        >
                          <Divider />
                          <MenuItem key="edit-blog" onClick={handleEditClick}>
                            <MdEditNote style={{ marginRight: ".5rem" }} /> Edit
                            Blog
                          </MenuItem>
                          <MenuItem key="delete-blog">
                            <DeleteBlog id={blog?._id} />
                          </MenuItem>
                        </Box>,
                      ]}
                    </Menu>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <CardContent sx={{ margin: "auto", padding: "1rem" }}>
                    <CommentForm blogId={blog?._id} userId={currentUser?._id} />
                    {showComments ? (
                      blog?.comments?.length > 0 ? (
                        blog?.comments?.map((comment) => (
                          <Box
                            key={comment._id}
                            sx={{
                              margin: "auto",
                              width: { xs: "70vw", md: "45vw" },
                              backgroundColor: "primary.ligth",
                              padding: ".8rem",
                              borderRadius: "1rem",
                              my: 4,
                              border: "1px solid #e0e0e0",
                              boxShadow: 2,
                            }}
                          >
                            <CardHeader
                              sx={{
                                paddingBottom: "0.5rem",
                                "& .MuiTypography-root": {
                                  fontSize: 14,
                                  fontWeight: "bold",
                                },
                              }}
                              avatar={
                                <Avatar aria-label="recipe">
                                  {comment?.userId?.image ? (
                                    <img
                                      src={comment?.userId?.image}
                                      alt="user"
                                      style={{ width: "100%" }}
                                    />
                                  ) : (
                                    comment?.userId?.firstName
                                      .charAt(0)
                                      .toUpperCase()
                                  )}
                                </Avatar>
                              }
                              title={`${comment.userId.firstName} ${comment.userId.lastName}`}
                              subheader={`${new Date(
                                comment.createdAt
                              ).toLocaleDateString("de-DE")}`}
                            />
                            <Typography
                              sx={{
                                mt: 1,
                                ml: 9,
                                paddingRight: "1rem",
                                textAlign: "justify",
                              }}
                            >
                              {comment.comment}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography
                          sx={{
                            textAlign: "center",
                            mt: 5,
                            fontSize: "1.2rem",
                            color: "text.secondary",
                          }}
                        >
                          There are no comments yet...
                        </Typography>
                      )
                    ) : null}
                  </CardContent>
                </Box>
              </Box>
            </Grid>
          </Grid>
          {openEditModal && (
            <EditBlogModal
              open={openEditModal}
              onClose={handleEditClose}
              blog={blog}
              initialState={initialState}
            />
          )}
        </Card>
      )}
    </>
  );
};

export default Detail;

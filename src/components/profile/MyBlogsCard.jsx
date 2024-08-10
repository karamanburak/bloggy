import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import {
  Box,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { useSelector } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import DeleteBlog from "../blog/DeleteBlog";
import { MdEditNote } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import EditBlogModal from "../blog/EditBlogModal";
const MyBlogsCard = ({
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
  const { currentUser } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const calcReadingTime = () => {
    const words = content.split(" ").length;
    const minutes = Math.ceil(words / 150);
    if (minutes >= 1) {
      setReadingTime(`${minutes} min read`);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/`;
    navigator.clipboard.writeText(link);
    handleMenuClose();
  };

  useEffect(() => {
    calcReadingTime();
  }, []);

  return (
    <Container
      sx={{
        paddingBottom: "2rem",
        width: { xs: "120%", sm: "80%" },
        marginLeft: { xs: "-2rem", sm: "auto" },
      }}
    >
      <Card
        sx={{
          borderRadius: "10px",
          backgroundColor: "white",
        }}
      >
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingX: 3,
          }}
        >
          <Typography sx={{ fontWeight: "bold", color: "black" }}>
            {title}
          </Typography>
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
              marginBottom: "1rem",
              marginRight: "1rem",
              cursor: "pointer",
            }}
          >
            <MdArrowOutward style={{ color: "black" }} />
          </Typography>
        </Box>
        <CardContent>
          <Typography
            variant="body2"
            sx={{
              maxHeight: "100px",
              // textAlign: "justify",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "3",
              WebkitBoxOrient: "vertical",
              color: "gray",
            }}
          >
            {content}
          </Typography>
        </CardContent>
        <Box
          sx={{
            display: { xs: "block", sm: "flex" },
            justifyContent: "space-between",
            paddingBottom: ".5rem",
          }}
        ></Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <CardHeader
            sx={{
              color: "seagreen",
              "& .MuiTypography-root": {
                fontSize: 15,
                fontWeight: "bold",
                color: "gray",
              },
            }}
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="image">
                {_id ? (
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`}
                    alt="image"
                  />
                ) : (
                  "R"
                )}
              </Avatar>
            }
            title={`${currentUser.firstName} ${currentUser.lastName}`}
            subheader={new Date(createdAt).toLocaleDateString("de-DE")}
          />
          <Box sx={{ marginRight: "1rem", marginTop: "1rem" }}>
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
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Divider />
                <MenuItem key="delete">
                  <DeleteBlog id={_id} />
                </MenuItem>
              </Box>
            </Menu>
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default MyBlogsCard;

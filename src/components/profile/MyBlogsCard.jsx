import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Box,
  Container,
} from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import { IoIosLink } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import DeleteBlog from "../blog/DeleteBlog";

const MyBlogsCard = ({ _id, content, image, title, createdAt }) => {
  const navigate = useNavigate();
  const [readingTime, setReadingTime] = useState(null);
  const { currentUser } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const calcReadingTime = () => {
    const words = content.split(" ").length;
    const minutes = Math.ceil(words / 150);
    setReadingTime(minutes >= 1 ? `${minutes} min read` : "Quick read");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/blog/detail/${_id}`;
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
          // backgroundColor: "primary.dark",
        }}
      >
        <CardMedia
          sx={{
            marginTop: "1rem",
            padding: "1rem",
            borderRadius: "1.5rem",
            objectFit: "cover",
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
          <Typography sx={{ fontWeight: "bold" }}>{title}</Typography>
          <Typography
            onClick={() => navigate(`/blog/detail/${_id}`)}
            sx={{
              cursor: "pointer",
            }}
          >
            <MdArrowOutward style={{ color: "#ff6f61" }} />
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
              "& .MuiTypography-root": {
                fontSize: 15,
                fontWeight: "bold",
              },
            }}
            avatar={
              <Avatar sx={{ bgcolor: "#ff6f61" }} aria-label="image">
                <img
                  src={currentUser?.image}
                  alt="user"
                  style={{ width: "100%" }}
                />
              </Avatar>
            }
            title={`${currentUser.firstName} ${currentUser.lastName}`}
            subheader={new Date(createdAt).toLocaleDateString("de-DE")}
          />
          <Box sx={{ marginRight: "1rem", marginTop: "1rem" }}>
            <IconButton onClick={handleMenuOpen}>
              <BsThreeDots style={{ color: "#ff6f61" }} />
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

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
} from "@mui/material";
import UpdateProfileModal from "../components/profile/UpdateProfileModal";
import MyBlogsContainer from "../components/profile/MyBlogsContainer";
import Footer from "../components/home/Footer";
import useCategoryCall from "../hooks/useCategoryCall";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { getCategory } = useCategoryCall();
  const { image, username, email, bio, city, createdAt, firstName, lastName } =
    currentUser;

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  useEffect(() => {
    getCategory("categories");
  }, []);

  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "primary.main",
          minHeight: "100vh",
          paddingY: "7rem",
        }}
      >
        <Grid
          container
          sx={{
            padding: { lg: "3rem", xs: "1rem" },
            borderRadius: "16px",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                : "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              borderRight: { lg: "1px solid #ddd" },
              paddingRight: { lg: "2rem" },
            }}
          >
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "none",
                padding: "1rem",
              }}
            >
              <CardMedia
                component="img"
                image={image}
                alt="profilePhoto"
                sx={{
                  borderRadius: "50%",
                  width: "150px",
                  height: "150px",
                  objectFit: "fill",
                }}
              />
              <CardContent sx={{ padding: "2rem 0" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ fontWeight: "bold" }}
                    >
                      {firstName} {lastName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginTop: "0.5rem" }}
                    >
                      @{username}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginTop: "0.5rem", marginBottom: "1rem" }}
                >
                  {email}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    {city}
                  </Typography>
                  <Button
                    sx={{ textAlign: "end" }}
                    variant="standard"
                    color="primary"
                    onClick={handleOpen}
                  >
                    Edit
                  </Button>
                </Box>
                <Divider sx={{ marginY: "1rem" }} />
                <Typography variant="body1" sx={{ textAlign: "justify" }}>
                  {bio}
                </Typography>
                <Divider sx={{ marginY: "1rem" }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "right" }}
                >
                  Created Date:
                  {new Date(createdAt).toLocaleDateString("de-DE")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <MyBlogsContainer userId={currentUser._id} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <UpdateProfileModal
        open={open}
        handleClose={handleClose}
        {...currentUser}
      />
    </>
  );
};

export default Profile;

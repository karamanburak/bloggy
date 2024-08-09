import { Box, Button, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { flex, profileStyle } from "../styles/globalStyles";
import UpdateProfileModal from "../components/profile/UpdateProfileModal";
import MyBlogsContainer from "../components/profile/MyBlogsContainer";
import Footer from "../components/home/Footer";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { image, username, email, bio, city, createdAt, firstName, lastName } =
    currentUser;
  // console.log(currentUser);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const localDate = () => {
    if (createdAt) {
      const date = new Date(createdAt);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
  };

  return (
    <>
      <Container
        maxWidth="false"
        sx={{
          ...flex,
          backgroundColor: "primary.main",
          minHeight: "100vh",
          paddingTop: "5rem",
        }}
      >
        <Grid container sx={{ padding: { lg: "3rem" }, m: 4 }}>
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              backgroundColor: "#FFD506",
              padding: "2rem",
              borderTopLeftRadius: "2rem",
              borderBottomLeftRadius: "2rem",
            }}
          >
            <Button
              onClick={handleOpen}
              variant="contained"
              sx={{
                backgroundColor: "#4182F9",
                color: "#FFF",
                display: "block",
                marginLeft: "auto",
                marginBottom: "3rem",
              }}
            >
              Edit
            </Button>
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <img
                src={image}
                alt="profilePhoto"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  marginBottom: "3rem",
                }}
              />
              <Box>
                <Typography
                  sx={{
                    ...profileStyle,
                    marginTop: { xs: "1rem", sm: "1.5rem" },
                  }}
                >
                  {firstName} {lastName}
                </Typography>
                <Typography sx={{ display: "block" }}>{email}</Typography>
              </Box>
            </Box>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "end",
                marginTop: "-2rem",
              }}
            >
              {`Created Date: ${localDate()}`}
            </Typography>
            <Typography sx={{ ...profileStyle, textAlign: "justify" }}>
              <Typography variant="span" sx={{ mt: 6 }}>
                Personal Information <br />
                {bio}
              </Typography>
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              backgroundColor: "#E0ECFF",
              padding: "2rem",
              borderTopRightRadius: "2rem",
              borderBottomRightRadius: "2rem",
            }}
          >
            <UpdateProfileModal
              open={open}
              handleClose={handleClose}
              handleOpen={handleOpen}
              {...currentUser}
            />
            <MyBlogsContainer {...currentUser} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};
export default Profile;

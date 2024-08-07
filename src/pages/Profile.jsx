import { Box, Button, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { flex, profileStyle } from "../styles/globalStyles";
import { useNavigate } from "react-router-dom";
import UpdateProfileModal from "../components/profile/UpdateProfileModal";
import MyBlogsContainer from "../components/profile/MyBlogsContainer";
import Footer from "../components/home/Footer";

const Profile = () => {
  const { currentUser } = useSelector(state => state.auth)
  const { image, username, email, bio, city, createdAt, firstName, lastName } = currentUser
  // console.log(currentUser);
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true)

  const localDate = () => {
    if (createdAt) {
      return new Date(createdAt).toLocaleString("de-DE")
    }
  }




  return (
    <>

      <Container maxWidth="false" sx={{
        ...flex, backgroundColor: "primary.main", minHeight: "100vh",
        paddingTop: "5rem"
      }}>
        <Grid container sx={{ padding: { lg: "3rem" }, m: 4 }}>
          <Grid item xs={12} lg={6} sx={{
            backgroundColor: "#FFD500",
            padding: "2rem",
            borderTopLeftRadius: "2rem",
            borderBottomLeftRadius: "2rem",
          }}>
            <Button
              onClick={handleOpen}
              variant="contained" sx={{ backgroundColor: "#4182F9", color: "#FFF", display: "block", marginLeft: "auto", marginBottom: "3rem" }}>
              Edit
            </Button>
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <img src={image} alt="profilePhoto" style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                // display: "block",
                // margin: "auto",
                marginBottom: "3rem",
              }} />
              <Box>
                <Typography sx={{ ...profileStyle, marginTop: { xs: "1rem", sm: "1.5rem" } }}>
                  {firstName} {lastName}
                </Typography>
                {/* <Typography sx={profileStyle}>
                {username}
              </Typography> */}
                <Typography sx={{ display: "block" }}>
                  {email}
                </Typography>
              </Box>

              {/* <Typography sx={{ ...profileStyle, marginBottom: "1rem" }}>
                {city}
              </Typography> */}
            </Box>
            <Typography sx={{
              display: "flex",
              justifyContent: "end",
              // fontSize: "1.2rem",
              marginTop: "-2rem"
            }}>
              {`Created Date: ${localDate()}`}
            </Typography>
            <Typography sx={{ ...profileStyle, textAlign: "justify" }}>
              <Typography variant="span" sx={{ mt: 8 }}>Personal Information <br />{bio}</Typography>
            </Typography>
          </Grid>
          <Grid item xs={12} lg={6} sx={{
            backgroundColor: "#E0ECFF",
            padding: "2rem",
            borderTopRightRadius: "2rem",
            borderBottomRightRadius: "2rem"
          }}>
            <Button
              onClick={() => navigate("/blog")}
              variant="contained"
              sx={{
                backgroundColor: "primary.light",
                display: "block",
                marginLeft: "auto",
                marginBottom: "1rem",
              }}

            >
              Blogs
            </Button>
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
  )
}
export default Profile;

import { Button, Container, Grid, Typography } from "@mui/material";
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

      <Container maxWidth="false" sx={{ ...flex, backgroundColor: "primary.main", minHeight:"100vh" }}>
        <Grid container sx={{ padding: { lg: "3rem" } , m:4}}>
          <Grid item xs={12} lg={6} sx={{
            backgroundColor: "#FFD500",
            padding: "2rem",
            borderTopLeftRadius: "2rem",
            borderBottomLeftRadius: "2rem",

          }}>
            <Button
              onClick={handleOpen}
              variant="contained" sx={{ backgroundColor: "primary.light", display: "block", marginLeft: "auto", marginBottom: "3rem" }}>
              Update Profile
            </Button>
            <img src={image} alt="profilePhoto" style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              display: "block",
              margin: "auto",
              marginBottom: "3rem",
            }} />

            <Typography sx={profileStyle}>
              First Name:
              <Typography variant="span" color="red">{firstName}</Typography>
            </Typography>
            <Typography sx={profileStyle}>
              Last Name:
              <Typography variant="span" color="red">{lastName}</Typography>
            </Typography>
            <Typography sx={profileStyle}>
              Username:
              <Typography variant="span" color="red">{username}</Typography>
            </Typography>
            <Typography sx={profileStyle}>
              Email:
              <Typography variant="span" color="red">{email}</Typography>
            </Typography>
            <Typography sx={{ ...profileStyle, marginBottom: "1rem" }}>
              City:
              <Typography variant="span" color="red">{city}</Typography>
            </Typography>
            <Typography sx={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "1rem",
              color: "blue",
              fontSize: "1.2rem",
            }}>
              {`Created Date: ${localDate()}`}
            </Typography>
            <Typography sx={{ ...profileStyle, textAlign: "justify" }}>
              <Typography variant="span" sx={{ fontSize: "1.2rem", mt: 8 }}>{bio}</Typography>
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

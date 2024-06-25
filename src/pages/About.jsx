import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import Footer from './../components/home/Footer';
import { flex } from "../styles/globalStyles";
import { useTheme } from "@emotion/react";

const avatars = [
  {
    name: "Ferenc Molnár",
    position: "Founder & Co-CEO"
  },
  {
    name: " Luca Guadagnino",
    position: "Co-CEO"
  },
  {
    name: "Diego Hitchcock",
    position: " Editor"
  },
  {
    name: "Dario Argento",
    position: "Editor"
  },
  {
    name: "Thomas Müller",
    position: "Editor"
  },
  {
    name: "Denis Schröder",
    position: "Editor"
  },
]


const About = () => {
  const theme = useTheme()

  return (
    <Box sx={{ backgroundColor: "primary.main" }}>
      <Container>
        <Typography variant="h3" sx={{
          fontStyle: "italic",
          marginBottom: "2rem",
          paddingTop: "2rem",
          textAlign: "center",
        }}>
          Unleash Your Creativity <br />
          <span style={{ color: "green" }}> Dream, Explore, Create</span>
        </Typography>
        <Box sx={{
          color: theme.palette.mode === "dark" ? "#fff" : "#000"
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", textAlign: "center" }}>About Us</Typography>
          <Typography sx={{ fontSize: "1.2rem" }}>
            <br />
            At Bloggy, we are passionate about sharing stories, insights, and knowledge across a variety of topics. Our mission is to create a platform where readers can find engaging content that informs, inspires, and entertains.
          </Typography>
          <br />
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>Who We Are</Typography>
          <Typography sx={{ fontSize: "1.2rem" }}>
            We are a diverse team of writers, editors, and enthusiasts who come together to bring you fresh perspectives on topics that matter. From technology and lifestyle to travel and personal development, our team is dedicated to delivering high-quality articles that resonate with our readers.
          </Typography>
          <br />
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>Our Mission</Typography>
          <Typography sx={{ fontSize: "1.2rem" }}>
            Our mission is to connect people through the power of storytelling. We believe that everyone has a story to tell and valuable insights to share. By providing a space for these stories, we hope to foster a community of curious and thoughtful readers.
          </Typography>
          <br />
          <Typography variant="h5" sx={{ fontWeight: "bold" }}> What We Offer</Typography>
          <Typography sx={{ fontSize: "1.2rem" }}>
            <strong>In-Depth Articles:</strong> Comprehensive and well-researched articles that delve into various subjects.
            <br />
            <strong>Personal Stories:</strong> Real-life experiences and narratives that inspire and motivate.
            <br />
            <strong>Expert Insights:</strong> Tips and advice from industry experts and thought leaders.
            <br />
            <strong>Personal Stories:</strong> Real-life experiences and narratives that inspire and motivate.
            <br />
            <strong>Engaging Content:</strong> Interactive and multimedia content to enhance your reading experience.
          </Typography>
          <br />
          <Typography variant="h5" sx={{ fontWeight: "bold" }}> Join Our Community </Typography>
          <Typography sx={{ fontSize: "1.2rem" }}>
            We invite you to join our growing community of readers and contributors. Follow us on social media, subscribe to our newsletter, and feel free to reach out with your thoughts and feedback. Your voice is important to us, and we are always eager to hear from our readers.
          </Typography>
          <br />
          <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
            Thank you for being a part of Bloggy. Together, let's dream, explore, and create.
          </Typography>
        </Box>
        <Box sx={{
          borderRadius: "10px",
          padding: "2rem",
          marginTop: "2rem",
          marginBottom: "5rem",
        }}>
          <Typography variant="h4" sx={{
            textAlign: "center"
          }}>
            Our Team
          </Typography>
          <Grid container spacing={3} mt={3} sx={{ ...flex, textAlign: "center" }} >
            {avatars.map((avatar, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <img
                  style={{
                    width: "224px",
                    height: "224px",
                    borderRadius: "50%",
                    backgroundColor: "#fff"
                  }}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar.name}`}
                  alt=""
                />
                <Typography variant="h5" align="center" sx={{
                  marginRight: "1rem",
                  marginTop: "1rem",
                  color: "red"
                }}>
                  {avatar.name}
                </Typography>
                <Typography align="center" sx={{
                  marginRight: "1rem",
                }}>
                  {avatar.position}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <Box>
        <Footer />
      </Box>
    </Box>
  )
};

export default About;

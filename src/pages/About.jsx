import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import Footer from './../components/home/Footer';
import { flex } from "../styles/globalStyles";

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
    name: "Alfred Hitchcock",
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
  return (
    <Box sx={{backgroundColor:"primary.dark"}}>
    <Container>
      <Typography variant="h3" sx={{ 
        fontStyle: "italic",
         marginBottom: "2rem", 
         paddingTop:"2rem",
         textAlign: "center",
         color:"whitesmoke"
          }}>
        Unleash Your Creativity <br />
          <span style={{ color: "cornflowerblue" }}> Dream, Explore, Create</span>
      </Typography>
      <Box sx={{ 
        backgroundColor: "neutral.dark", 
        borderRadius: "10px", 
        padding: "2rem", 
        marginTop: "2rem",
         marginBottom: "5rem", 
         color:"secondary.light" 
         }}>
        <Typography variant="h4" sx={{
           color: "cornflowerblue",
            textAlign: "center" 
            }}>
          Our Team
        </Typography>
        <Grid container spacing={3} mt={3} sx={{...flex,textAlign:"center"}} >
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
                color:"gray" 
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

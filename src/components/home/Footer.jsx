import { Box, Divider, Grid, Toolbar, Typography } from "@mui/material";
import WeatherCard from "./WeatherCard";
import { FaSquareGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { FaInstagram } from "react-icons/fa";
import { useTheme } from "@emotion/react";
import logo from "../../assets/logo.png";

const links = [
  {
    address: "mailto:karaman.buraak@gmail.com",
    icon: SiGmail,
    target: "_blank",
  },
  {
    address: "https://github.com/karamanburak",
    icon: FaSquareGithub,
    target: "_blank",
  },
  {
    address: "https://www.linkedin.com/in/karamanburak/",
    icon: FaLinkedin,
    target: "_blank",
  },
  {
    address: "https://www.instagram.com/karamanburaak/",
    icon: FaInstagram,
    target: "_blank",
  },
];

const currentYear = new Date().getFullYear();

const grid1 = [
  { name: "Overview" },
  { name: "Features" },
  { name: "Tutorials" },
  { name: "Pricing" },
  { name: "Releases" },
];
const grid2 = [
  { name: "Company" },
  { name: "Careers" },
  { name: "Press" },
  { name: "News" },
  { name: "Media" },
];
const grid3 = [
  { name: "Blog" },
  { name: "NewsLetter" },
  { name: "Events" },
  { name: "Support" },
  { name: "Places" },
];
const grid4 = [
  { name: "Terms" },
  { name: "Privacy" },
  { name: "Cookies" },
  { name: "Licenses" },
  { name: "Settings" },
];

const Footer = ({ isDashboard }) => {
  const theme = useTheme();
  const boxShadow =
    theme.palette.mode === "dark"
      ? "0 4px 12px rgba(10, 10, 10, 0.7)"
      : "0 4px 12px rgba(0, 0, 0, 0.5)";
  return (
    <>
      <Grid
        container
        direction="row"
        backgroundColor="neutral.dark"
        color="neutral.light"
        justifyContent="center"
        alignItems="center"
        sx={{
          textAlign: "center",
          boxShadow: boxShadow,
          paddingX: "2rem",
          paddingY: "1rem",
        }}
      >
        <Grid
          sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
          item
          xs={3}
          sm={2}
        >
          {grid1.map((item, index) => (
            <Box key={index}>{item.name}</Box>
          ))}
        </Grid>
        <Grid
          sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
          item
          xs={3}
          sm={2}
        >
          {grid2.map((item, index) => (
            <Box key={index}>{item.name}</Box>
          ))}
        </Grid>
        <Grid
          sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
          item
          xs={3}
          sm={2}
        >
          {grid3.map((item, index) => (
            <Box key={index}>{item.name}</Box>
          ))}
        </Grid>
        <Grid
          sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
          item
          xs={3}
          sm={2}
        >
          {grid4.map((item, index) => (
            <Box key={index}>{item.name}</Box>
          ))}
        </Grid>
        <Grid
          item
          xs={12}
          sm={2}
          sx={{
            display: { xs: "flex", sm: "block" },
            flexDirection: { xs: "row", sm: "column" },
          }}
        >
          {links.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <Typography
                key={index}
                sx={{
                  margin: "auto",
                  marginLeft: "2rem",
                  marginTop: "1rem",
                  "&:hover": {
                    transform: "scale(1.10)",
                  },
                }}
              >
                {(isDashboard !== "/" || link.address !== "/") && (
                  <a href={link.address} target={link.target}>
                    <IconComponent
                      size={25}
                      style={{
                        color: theme.palette.neutral.light,
                        opacity: 0.8,
                      }}
                    />
                  </a>
                )}
              </Typography>
            );
          })}
        </Grid>
        <Divider />
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            width: "70vw",
          }}
        >
          <Typography sx={{ display: { xs: "none", md: "block" } }}>
            <img
              src={logo}
              alt="logo"
              width="50px"
              style={{ marginTop: "1rem" }}
            />
          </Typography>
          <Typography
            sx={{
              color: "neutral.light",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "2.2rem",
              marginLeft: { md: "4rem" },
            }}
          >
            &copy; {currentYear} Bloggy. All Rights Reserved
          </Typography>
          <Box
            sx={{
              color: "neutral.light",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "2rem",
              display: { xs: "none", sm: "block" },
            }}
          >
            <WeatherCard />
          </Box>
        </Toolbar>
      </Grid>
    </>
  );
};

export default Footer;

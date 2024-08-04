import { Box, Toolbar, Typography } from '@mui/material';
import WeatherCard from './WeatherCard';
import { FaSquareGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { MdHome } from "react-icons/md";
import { useTheme } from '@emotion/react';



const links = [
    {
        address: "/",
        icon: MdHome,
    },
    {
        address: "https://mailto:karaman.buraak@gmail.com",
        icon: SiGmail,
        target: "_blank"
    },
    {
        address: "https://github.com/karamanburak",
        icon: FaSquareGithub,
        target: "_blank"
    },
    {
        address: "https://www.linkedin.com/in/karamanburak/",
        icon: FaLinkedin,
        target: "_blank"
    },
]

const currentYear = new Date().getFullYear();

const Footer = ({ isDashboard }) => {
    const theme = useTheme();
    return (
        <Toolbar sx={{ backgroundColor: "neutral.dark" }}>
            <Box sx={{ display: { xs: "none", md: 'block' } }}>
                <WeatherCard />
            </Box>

            <Typography sx={{ color: "neutral.light", fontWeight: "bold", flexGrow: 1, display: { xs: "none", sm: 'block' }, textAlign: "center" }}>

                &copy;  {currentYear} Bloggy. All Rights Reserved

            </Typography>



            {links.map((link, index) => {
                const IconComponent = link.icon;
                return (
                    <Typography key={index} sx={{
                        margin: "auto",
                        marginLeft: ".5rem",
                        '&:hover': {
                            transform: "scale(1.10)"
                        }
                    }}>
                        {(isDashboard !== '/' || link.address !== '/') && (
                            <a href={link.address} target={link.target}>
                                <IconComponent size={25} style={{ color: theme.palette.neutral.light, opacity: 0.8 }} />
                            </a>
                        )}
                    </Typography>
                );
            })}
        </Toolbar>
    )
};

export default Footer;

import { Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import WeatherCard from './WeatherCard';


const links = [
    {
        address: "/",
        src: "https://img.icons8.com/bubbles/50/home.png",
    },
    {
        address: "https://mailto:karaman.buraak@gmail.com",
        src: "https://img.icons8.com/bubbles/50/new-post.png",
        target: "_blank"
    },
    {
        address: "https://github.com/karamanburak",
        src: "https://img.icons8.com/bubbles/50/github.png",
        target: "_blank"
    },
    {
        address: "https://www.linkedin.com/in/karamanburak/",
        src: "https://img.icons8.com/bubbles/50/linkedin.png",
        target: "_blank"
    },
]

const Footer = ({isDashboard}) => {

    return (
        <Toolbar sx={{backgroundColor:"neutral.dark"}}>
            <Box sx={{ display: { xs: "none", md: 'block' }}}>
                <WeatherCard/>
            </Box>
         
            <Typography sx={{ color: "neutral.light", fontWeight: "bold", flexGrow: 1, display: { xs: "none", sm: 'block' }, textAlign: {sm:"left", md:"center"} }}>
                Developed by Burak Karaman &copy; 2024
            </Typography>

         

            {links.map((link, index) => (
                <Typography key={index} sx={{ margin:"auto",
                    '&:hover': {
                        transform: "scale( 1.10)"
                    }
                }}>
                {(isDashboard !== '/' || link.address !== '/') && (
                      <a href={link.address} target={link.target}>
                        <img width="50" height="50" src={link.src} alt="new-post" />
                    </a>
                )}
                </Typography>
            ))}
        </Toolbar>
    )
};

export default Footer;

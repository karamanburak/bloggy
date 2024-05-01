import { Box } from '@mui/material';
import home from '../assets/home.png'
import HomeCard from '../components/home/HomeCard';
import Footer from '../components/home/Footer';
const Home = () => {

    return (
        <Box
            sx={{ backgroundColor: "primary.main" }} >
            <img src={home} alt="image" width="100%" />
            <Box sx={{ width: "80vw", margin: "auto" }}>
                <HomeCard />
            </Box>
            <Footer />
        </Box>
    )
};

export default Home;

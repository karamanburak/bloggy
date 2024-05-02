import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import LightModeSharpIcon from '@mui/icons-material/LightModeSharp';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { ColorModeContext } from '../../styles/theme';
import { useContext } from 'react';
import avatar from '../../assets/avatar.png'
import useAuthCall from '../../hooks/useAuthCall';
import { useSelector } from 'react-redux';

const pages = [
    { name: 'Dashboard', src: '/' },
    { name: 'Blogs', src: '/blog' },
    { name: 'About Us', src: '/about' },
    { name: 'Contact', src: '/contact' }
];

function Navbar() {
    const {logout} = useAuthCall()
    const {currentUser} = useSelector(state => state.auth)

    const theme = useTheme()
    const colorMode = useContext(ColorModeContext)
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate()
    
    const settings = currentUser ?[
        { name: 'Profile', src: '/profile' },
        { name: 'Account', src: '/account' },
        { name: 'Sign Out', src: 'login' },
    ] : [
        { name: 'Sign In', src: '/login' },
        { name: 'Register', src: '/register' },


    ]

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleSettingClick = (src) => {
        if (src === 'login') {
            logout();
        } else {
            navigate(src);
        }
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "neutral.dark"}}>
            <Container sx={{ minWidth: "95vw" }}>
                <Toolbar disableGutters>
                    <Typography sx={{ display: {xs:"none", md: "block" } }}>
                    <img src={logo} alt="register image" width="150px"
                    />
                </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.src} onClick={() => navigate(page.src)}>
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    
                    <Typography
                    onClick= {() => navigate("/")}
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: .7,
                            cursor:"pointer"
                        }}
                    >
                        <img src={logo} alt="register image" width="150px"
                        />
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.src}
                                onClick={() => navigate(page.src)}
                                sx={{ my: 2, color: "neutral.light", display: 'block' }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>
                    <IconButton
                        sx={{ width: "40px", height: "40px", marginRight: ".5rem" }}
                        onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === "dark" ? (
                            <NightsStayIcon />
                        ) : (
                            <LightModeSharpIcon />
                        )}
                    </IconButton>
                    <Box sx={{ marginRight: "1rem", fontWeight: "bold" }}>
                        {currentUser}
                    </Box>
                    <Box>
                        <Tooltip title="Open Menu">
                            <IconButton onClick={handleOpenUserMenu} >
                                <img src={avatar} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                           </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting, index) => (
                                <MenuItem key={index} onClick={() => handleSettingClick(setting.src)}>
                                    <Typography textAlign="center">{setting.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Navbar;
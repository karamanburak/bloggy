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
import { useState } from 'react';
import { avatarNavbar } from '../../styles/globalStyles'
import { toastWarnNotify } from '../../helper/ToastNotify';

const pages = [
    { name: 'Dashboard', src: '/' },
    { name: 'Blogs', src: '/blog' },
    { name: 'About Us', src: '/about' },
];

function Navbar() {
    const { logout } = useAuthCall()
    const { currentUser } = useSelector(state => state.auth)
    // console.log(currentUser);
    const theme = useTheme()
    const colorMode = useContext(ColorModeContext)
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate()

    const settings = currentUser ? [
        { name: 'Profile', src: '/profile' },
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
            logout()
            setAnchorElUser(null);
        } else {
            navigate(src);
        }
    };


    return (
        <AppBar position="static" sx={{ backgroundColor: "neutral.dark" }}>
            <Container sx={{ minWidth: "95vw" }}>
                <Toolbar disableGutters>
                    <Typography
                        onClick={() => navigate("/")}
                        sx={{ display: { xs: "none", md: "block", cursor: "pointer" } }}>
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
                                <MenuItem key={page.src}
                                    onClick={() => { !currentUser && page.name === "Blogs" ? (toastWarnNotify("You must login")) : (navigate(page.src)) }} >
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Typography
                        onClick={() => navigate("/")}
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: .7,
                            cursor: "pointer"
                        }}
                    >
                        <img src={logo} alt="register image" width="150px"
                        />
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.src}

                                onClick={() => { !currentUser && page.name === "Blogs" ? (toastWarnNotify("You must login")) : (navigate(page.src)) }}
                                sx={{ my: 2, color: "neutral.light", display: 'block' }}
                            >
                                <Typography sx={{
                                    marginTop: "1rem"
                                }}>

                                    {page.name}
                                </Typography>
                            </Button>
                        ))}
                    </Box>

                    <Box>
                        {currentUser ? (
                            <Box onClick={handleOpenUserMenu} sx={avatarNavbar}>
                                <img src={currentUser.image} alt="" style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    marginTop: "1.5rem"
                                }} />
                                <Typography>
                                    {`${currentUser.firstName}  ${currentUser.lastName}`}
                                </Typography>
                            </Box>
                        ) : (
                            <Tooltip title="Open Menu">
                                <IconButton onClick={handleOpenUserMenu} >
                                    <img src={avatar} alt="" style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%"
                                    }} />
                                </IconButton>
                            </Tooltip>
                        )}
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
                            <IconButton
                                sx={{ width: "40px", height: "40px", marginLeft: "1.5rem" }}
                                onClick={colorMode.toggleColorMode}>
                                {theme.palette.mode === "dark" ? (
                                    <NightsStayIcon />
                                ) : (
                                    <LightModeSharpIcon />
                                )}
                            </IconButton>
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
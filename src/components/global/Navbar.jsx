import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import LightModeSharpIcon from "@mui/icons-material/LightModeSharp";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { ColorModeContext } from "../../styles/theme";
import { useContext } from "react";
import avatar from "../../assets/avatar.png";
import useAuthCall from "../../hooks/useAuthCall";
import { useSelector } from "react-redux";
import { useState } from "react";
import { avatarNavbar } from "../../styles/globalStyles";
import { toastWarnNotify } from "../../helper/ToastNotify";
import { BsPencilSquare } from "react-icons/bs";
import { useEffect } from "react";
import BlogModal from "../blog/BlogModal";
import { useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { MdLogin } from "react-icons/md";
import { FaRegRegistered } from "react-icons/fa";

function Navbar() {
  const { logout } = useAuthCall();
  const { currentUser } = useSelector((state) => state.auth);
  // console.log(currentUser);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { categories } = useSelector((state) => state.category);
  const navigate = useNavigate();
  const location = useLocation();
  const [navbarBg, setNavbarBg] = useState({
    backgroundColor: "transparent",
    opacity: 1,
  });
  const [navbarTextColor, setNavbarTextColor] = useState("white");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const [initialState, setInitialState] = useState({
    categoryId: "",
    title: "",
    content: "",
    image: "",
    isPublish: "",
  });

  const pages = [
    { name: "Dashboard", src: "/" },
    { name: "Blogs", src: "/blog" },
    { name: "About Us", src: "/about" },
  ];

  const settings = currentUser
    ? [
        {
          name: `@ ${currentUser.username}  `,
          withDivider: true,
        },
        { icon: <FaUser />, name: "Profile", src: "/profile" },
        { icon: <CiLogout />, name: "Logout", src: "login" },
      ]
    : [
        { icon: <MdLogin />, name: "Sign In", src: "/login" },
        { icon: <FaRegRegistered />, name: "Register", src: "/register" },
      ];

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
    if (src === "login") {
      logout();
      setAnchorElUser(null);
    } else {
      navigate(src);
    }
  };

  const handleScroll = () => {
    if (window.scrollY > window.innerHeight) {
      setNavbarBg({
        backgroundColor: theme.palette.neutral.dark,
        opacity: 0.9,
      });
      setNavbarTextColor(theme.palette.mode === "dark" ? "white" : "black");
    } else {
      setNavbarBg({
        backgroundColor: "transparent",
      });
      setNavbarTextColor("white");
    }
  };

  useEffect(() => {
    const isDetailPage = location.pathname.startsWith("/blog/detail/");
    if (
      location.pathname === "/profile" ||
      location.pathname === "/login" ||
      location.pathname === "/register" ||
      isDetailPage
    ) {
      if (isDetailPage) {
        setNavbarBg({
          display: "none",
        });
      } else {
        setNavbarBg({
          backgroundColor: "transparent",
          position: "absolute",
        });
        setNavbarTextColor(theme.palette.mode === "dark" ? "white" : "black");
      }
    } else {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
    setNavbarTextColor(theme.palette.mode === "dark" ? "white" : "black");
  }, [location, theme]);

  return (
    <Box
      position="fixed"
      sx={{
        backgroundColor: navbarBg,
        transition: "background-color 0.5s ease",
        zIndex: 99,
        width: "100vw",
      }}
    >
      <Container sx={{ minWidth: "95vw" }}>
        <Toolbar disableGutters>
          <Typography
            onClick={() => navigate("/")}
            sx={{ display: { xs: "none", md: "block", cursor: "pointer" } }}
          >
            <img
              src={logo}
              alt="logo"
              width="50px"
              style={{ marginTop: "1rem" }}
            />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
                color: "white",
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.src}
                  onClick={() => {
                    !currentUser && page.name === "Blogs"
                      ? toastWarnNotify("You must login")
                      : navigate(page.src);
                  }}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.src}
                onClick={() => {
                  !currentUser && page.name === "Blogs"
                    ? toastWarnNotify("You must login")
                    : navigate(page.src);
                }}
                sx={{ my: 2, display: "block" }}
              >
                <Typography
                  sx={{
                    marginTop: "1rem",
                    color: navbarTextColor,
                  }}
                >
                  {page.name}
                </Typography>
              </Button>
            ))}
          </Box>
          <Box>
            {currentUser && (
              <Typography
                sx={{
                  cursor: "pointer",
                  marginRight: "2rem",
                  marginTop: "1.7rem",
                  marginBottom: { xs: "1rem", md: "0" },
                  color: navbarTextColor,
                }}
                onClick={handleOpen}
              >
                <BsPencilSquare
                  style={{ fontSize: "1.2rem", marginBottom: ".3rem" }}
                />{" "}
                WRITE
              </Typography>
            )}
          </Box>
          <IconButton
            sx={{
              width: "40px",
              height: "40px",
              color: navbarTextColor,
              cursor: "pointer",
              marginRight: "2rem",
              marginTop: "1.7rem",
              fontSize: "1.2rem",
              marginBottom: { xs: "1rem", md: "0" },
            }}
            onClick={colorMode.toggleColorMode}
          >
            {theme.palette.mode === "dark" ? (
              <NightsStayIcon />
            ) : (
              <LightModeSharpIcon />
            )}
          </IconButton>

          <Box sx={{ marginBottom: { xs: "1rem", md: "0" } }}>
            {currentUser?.image ? (
              <Box onClick={handleOpenUserMenu} sx={avatarNavbar}>
                <img
                  src={currentUser.image}
                  alt="image"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginTop: "1.5rem",
                  }}
                />
              </Box>
            ) : (
              <Tooltip title="Open Menu">
                <IconButton onClick={handleOpenUserMenu}>
                  <img
                    src={avatar}
                    alt="image"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      marginTop: "1.5rem",
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleSettingClick(setting.src)}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {setting.icon && <Typography>{setting.icon}</Typography>}
                    <Typography>{setting.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
        {open && (
          <BlogModal
            open={open}
            categories={categories}
            handleClose={handleClose}
            initialState={initialState}
          />
        )}
      </Container>
    </Box>
  );
}
export default Navbar;

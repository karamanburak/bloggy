import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ColorModeContext } from "../../styles/theme";
import useAuthCall from "../../hooks/useAuthCall";
import useCategoryCall from "../../hooks/useCategoryCall";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";
import { FaUser } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { MdLogin, MdLightMode, MdDarkMode } from "react-icons/md";
import { FaRegRegistered } from "react-icons/fa";
import { HiMenu, HiX, HiShieldCheck } from "react-icons/hi";

const Navbar = () => {
  const { logout } = useAuthCall();
  const { currentUser } = useSelector((state) => state.auth);
  const { getCategory } = useCategoryCall();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const isAdmin = currentUser?.isAdmin || currentUser?.role === "admin";

  const userMenuItems = currentUser
    ? [
        { icon: <FaUser className="w-4 h-4" />, name: "Profile", path: "/profile" },
        ...(isAdmin
          ? [
              {
                icon: <HiShieldCheck className="w-4 h-4" />,
                name: "Admin Panel",
                path: "/admin",
              },
            ]
          : []),
        { icon: <CiLogout className="w-4 h-4" />, name: "Logout", action: "logout" },
      ]
    : [
        { icon: <MdLogin className="w-4 h-4" />, name: "Sign In", path: "/login" },
        { icon: <FaRegRegistered className="w-4 h-4" />, name: "Register", path: "/register" },
      ];

  useEffect(() => {
    getCategory("categories");
  }, []);


  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") || "light";
    setTheme(currentTheme);
    document.documentElement.classList.toggle("dark", currentTheme === "dark");
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    colorMode.toggleColorMode();
  };


  const handleUserMenuClick = (item) => {
    if (item.action === "logout") {
      logout();
    } else if (item.path) {
      navigate(item.path);
    }
    setUserMenuOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={logo}
                  alt="Bloggy Logo"
                  className="h-12 w-12 rounded-full object-cover aspect-square transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </div>
              <span className="ml-2 sm:ml-3 text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent transition-all duration-300">
                Bloggy
              </span>
            </div>


            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Admin Panel Button */}
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium bg-gradient-to-r from-purple-400 to-purple-500 text-white hover:from-purple-500 hover:to-purple-600 transition-all duration-300"
                >
                  <HiShieldCheck className="w-4 h-4" />
                  <span className="text-sm">Admin</span>
                </button>
              )}

              {/* Theme Toggle */}
              {/* <button
                onClick={handleToggleTheme}
                className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <MdLightMode className="w-6 h-6" />
                ) : (
                  <MdDarkMode className="w-6 h-6" />
                )}
              </button> */}

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  <div className="relative">
                    <img
                      src={currentUser?.image || avatar}
                      alt={currentUser?.username || "User"}
                      className="w-10 h-10 rounded-full border-2 border-primary-500 object-cover transition-all duration-300 group-hover:ring-4 ring-primary-400/50 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-50 animate-slide-down overflow-hidden">
                      {currentUser && (
                        <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-primary-50/50 to-accent-50/50 dark:from-primary-900/20 dark:to-accent-900/20">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {currentUser.firstName} {currentUser.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            @{currentUser.username}
                          </p>
                        </div>
                      )}
                      {userMenuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleUserMenuClick(item)}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 dark:hover:from-primary-900/20 dark:hover:to-accent-900/20 transition-all duration-200 hover:translate-x-1"
                        >
                          {item.icon}
                          <span className="font-medium">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 transition-all"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <HiX className="w-6 h-6" />
                ) : (
                  <HiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-lg font-medium bg-gradient-to-r from-purple-400 to-purple-500 text-white hover:from-purple-500 hover:to-purple-600 flex items-center space-x-2 transition-all duration-300"
                >
                  <HiShieldCheck className="w-4 h-4" />
                  <span>Admin Panel</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

    </>
  );
};

export default Navbar;
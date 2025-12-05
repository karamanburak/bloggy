import { Link } from "react-router-dom";
import {
  FaSquareGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import logo from "../../assets/logo.png";

const links = [
  {
    address: "mailto:karaman.buraak@gmail.com",
    icon: SiGmail,
    label: "Email",
    target: "_blank",
  },
  {
    address: "https://github.com/karamanburak",
    icon: FaSquareGithub,
    label: "GitHub",
    target: "_blank",
  },
  {
    address: "https://www.linkedin.com/in/karamanburak/",
    icon: FaLinkedin,
    label: "LinkedIn",
    target: "_blank",
  },
  {
    address: "https://www.instagram.com/karamanburaak/",
    icon: FaInstagram,
    label: "Instagram",
    target: "_blank",
  },
];

const currentYear = new Date().getFullYear();

const Footer = ({ isDashboard }) => {
  return (
    <footer className="relative z-10 bg-gray-900 dark:bg-gray-950 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
            <div className="flex items-center space-x-4">
              {links.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={index}
                    href={link.address}
                    target={link.target}
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-primary-600 text-gray-400 hover:text-white transition-all hover:scale-110"
                    aria-label={link.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Logo and Brand */}
          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={logo}
                alt="Bloggy Logo"
                className="h-10 w-10"
              />
              <span className="text-white font-bold text-lg">Bloggy</span>
            </div>
            <p className="text-gray-400 text-sm">
              Unleash Your Creativity
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} Bloggy. All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
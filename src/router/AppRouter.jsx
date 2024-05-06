import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRouter from "./PrivateRouter";
import Dashboard from "../pages/Dashboard";
import Blogs from "../pages/Blogs";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Profile from "../pages/Profile";
import Account from "../pages/Account";
import Navbar from "../components/global/Navbar";
import NotFound from "../pages/NotFound";
import Detail from "../pages/Detail";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        <Route path="" element={<PrivateRouter />}>
        <Route path="/profile" element={<Profile />} />
          <Route path="/blog" element={<Blogs />} />
          <Route path="/blog/detail/:id" element={<Detail />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;

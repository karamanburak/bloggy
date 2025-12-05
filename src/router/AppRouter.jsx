import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRouter from "./PrivateRouter";
import AdminRouter from "./AdminRouter";
import Dashboard from "../pages/Dashboard";
import Blogs from "../pages/Blogs";
import About from "../pages/About";
import Profile from "../pages/Profile";
import AdminPanel from "../pages/AdminPanel";
import Navbar from "../components/global/Navbar";
import NotFound from "../pages/NotFound";
import Detail from "../pages/Detail";
import CreateBlog from "../pages/CreateBlog";
import ScrollToTop from "../components/global/ScrollToTop";

const AppRouter = () => {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blog/detail/:id" element={<Detail />} />
        <Route path="*" element={<NotFound />} />
        <Route path="" element={<PrivateRouter />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/blog" element={<Blogs />} />
          <Route path="/blog/create" element={<CreateBlog />} />
        </Route>
        <Route path="" element={<AdminRouter />}>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/users" element={<AdminPanel />} />
          <Route path="/admin/activities" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;

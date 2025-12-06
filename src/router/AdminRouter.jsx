import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRouter = () => {
  const { currentUser } = useSelector((state) => state.auth);

  // Check if user is logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Check if user is admin
  const isAdmin = currentUser?.isAdmin || currentUser?.role === "admin";
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRouter;





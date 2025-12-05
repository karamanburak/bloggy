import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRouter = () => {
  const { currentUser } = useSelector((state) => state.auth);

  // Admin kontrolü: currentUser.isAdmin veya currentUser.role === 'admin' kontrolü
  const isAdmin = currentUser?.isAdmin || currentUser?.role === "admin";

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRouter;




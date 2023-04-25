import { Navigate, Outlet, Route } from "react-router-dom";
import useAuth from "../hooks/useAuth";
const PrivateRoutes = () => {
  const { auth } = useAuth();
  return auth.accessToken ? <Outlet /> : <Navigate to="/login" />;
};
export default PrivateRoutes;

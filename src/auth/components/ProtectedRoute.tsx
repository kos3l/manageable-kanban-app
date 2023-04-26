import { useEffect, useState } from "react";
import { Navigate, Outlet, Route } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useHttp from "../../hooks/useHttp";
import useRefreshToken from "../../hooks/useRefreshToken";

const PrivateRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { http } = useHttp();
  const { auth } = useAuth();
  const refresh = useRefreshToken(http);

  console.log(http, "axios instance in pricate routes");
  console.log(auth, "access token in pricate routes");

  const verifyRefreshToken = async () => {
    try {
      await refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!auth?.accessToken) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  return isLoading ? (
    <p>loading</p>
  ) : auth.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};
export default PrivateRoutes;
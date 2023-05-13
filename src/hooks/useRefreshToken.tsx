import { AxiosInstance } from "axios";
import useAuth from "./useAuth";

const useRefreshToken = (axios: AxiosInstance) => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get("/api/token/refresh", {
        withCredentials: true,
      });
      setAuth((prev) => {
        return { ...prev, accessToken: response.data.newAccessToken };
      });
      return response.data.newAccessToken;
    } catch (error) {
      return "";
    }
  };
  return refresh;
};

export default useRefreshToken;

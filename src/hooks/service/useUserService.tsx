import { AxiosResponse } from "axios";
import { IAccessToken } from "../../auth/context/AuthContext";
import { User } from "../../models/entities/User";
import useHttp from "../useHttp";

const useUserService = () => {
  const { get } = useHttp();
  const bastPath = "/api/user";

  const getLoggedInUserProfile = () => {
    return get<void, AxiosResponse<User>>(bastPath + "/profile", {
      withCredentials: true,
    });
  };

  return { getLoggedInUserProfile };
};

export default useUserService;

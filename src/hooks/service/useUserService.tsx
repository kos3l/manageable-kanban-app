import { AxiosResponse } from "axios";
import { IAccessToken } from "../../auth/context/AuthContext";
import { IUpdateUserDTO } from "../../models/dto/user/IUpdateUserDTO";
import { User } from "../../models/entities/User";
import useHttp from "../useHttp";

const useUserService = () => {
  const { get, put } = useHttp();
  const bastPath = "/api/user";

  const getLoggedInUserProfile = () => {
    return get<void, AxiosResponse<User>>(bastPath + "/profile", {
      withCredentials: true,
    });
  };

  const getUserByEmail = (email: string) => {
    return get<void, AxiosResponse<User>>(bastPath + "/email/" + email, {
      withCredentials: true,
    });
  };

  const getUsersByTeamId = (teamId: string) => {
    return get<void, AxiosResponse<User[]>>(bastPath + "/team/" + teamId, {
      withCredentials: true,
    });
  };

  const updateUserProfile = (userId: string, userDto: IUpdateUserDTO) => {
    return put<IUpdateUserDTO, AxiosResponse<void>>(
      bastPath + "/" + userId,
      userDto,
      { withCredentials: true }
    );
  };

  return {
    getLoggedInUserProfile,
    updateUserProfile,
    getUserByEmail,
    getUsersByTeamId,
  };
};
export default useUserService;

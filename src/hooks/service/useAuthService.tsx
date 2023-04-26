import { AxiosResponse } from "axios";
import { ICreateLoginDTO } from "../../models/dto/user/ICreateLoginDTO";
import { IAccessToken } from "../../auth/context/AuthContext";
import { ICreateUserDTO } from "../../models/dto/user/ICreateUserDTO";
import { IRegisterUserResponse } from "../../models/responses/IRegisterUserResponse";
import useHttp from "../useHttp";

const useAuthService = () => {
  const { post, get } = useHttp();
  const bastPath = "/api/auth";

  const registerUser = (newUser: ICreateUserDTO) => {
    return post<ICreateUserDTO, AxiosResponse<IRegisterUserResponse>>(
      bastPath + "/register",
      newUser
    );
  };

  const loginUser = (newUser: ICreateLoginDTO) => {
    return post<ICreateLoginDTO, AxiosResponse<IAccessToken>>(
      bastPath + "/login",
      newUser,
      {
        withCredentials: true,
      }
    );
  };

  const logoutUser = () => {
    return get<void, AxiosResponse<IAccessToken>>(bastPath + "/logout", {
      withCredentials: true,
    });
  };

  return { loginUser, logoutUser, registerUser };
};

export default useAuthService;

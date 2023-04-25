import { AxiosResponse } from "axios";
import { ICreateLoginDTO } from "../../models/dto/user/ICreateLoginDTO";
import { IAccessToken } from "../context/AuthContext";
import useHttp from "./useHttp";

const useAuthService = () => {
  const { post } = useHttp();

  const log = (newUser: ICreateLoginDTO) => {
    return post<ICreateLoginDTO, AxiosResponse<IAccessToken>>(
      "/api/auth/login",
      newUser,
      {
        withCredentials: true,
      }
    );
  };

  return { log };
};

export default useAuthService;

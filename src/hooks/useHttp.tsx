import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import AuthContext, { IAccessToken } from "../auth/context/AuthContext";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
}

const useHttp = () => {
  const { auth } = useAuth();

  const headers: Readonly<Record<string, string | boolean>> = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Credentials": true,
    "X-Requested-With": "XMLHttpRequest",
  };
  const baseUrl = import.meta.env.PROD
    ? import.meta.env.VITE_BASE_URL_PRODUCTION
    : import.meta.env.VITE_BASE_URL_DEVELOPMENT;

  console.log(baseUrl);
  const http = axios.create({
    baseURL: baseUrl,
    headers,
  });

  const refresh = useRefreshToken(http);

  function injectToken(
    config: InternalAxiosRequestConfig,
    auth: IAccessToken
  ): InternalAxiosRequestConfig<any> {
    try {
      if (config.headers && !config.headers["auth-token"]) {
        config.headers["auth-token"] = auth?.accessToken;
      }
      return config;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  function handleError(error: any) {
    const { status } = error;

    switch (status) {
      case StatusCode.InternalServerError: {
        // Handle InternalServerError
        break;
      }
      case StatusCode.Forbidden: {
        // Handle Forbidden
        break;
      }
      case StatusCode.Unauthorized: {
        // Handle Unauthorized
        break;
      }
      case StatusCode.TooManyRequests: {
        // Handle TooManyRequests
        break;
      }
    }

    return Promise.reject(error);
  }

  function initHttp() {
    http.interceptors.request.use(
      (value) => injectToken(value, auth),
      (error) => Promise.reject(error)
    );

    http.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { response } = error;
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["auth-token"] = newAccessToken;
          return http(prevRequest);
        }
        return handleError(response);
      }
    );

    return http;
  }

  const request = function request<T = any, R = AxiosResponse<T>>(
    config: AxiosRequestConfig
  ): Promise<R> {
    const useInstance = initHttp();
    return useInstance.request(config);
  };

  const get = function get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    const useInstance = initHttp();
    return useInstance.get<T, R>(url, config);
  };

  const post = function post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    const useInstance = initHttp();
    return useInstance.post<T, R>(url, data, config);
  };

  const put = function put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    const useInstance = initHttp();
    return useInstance.put<T, R>(url, data, config);
  };

  const remove = function remove<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    const useInstance = initHttp();
    return useInstance.delete<T, R>(url, config);
  };

  return {
    request,
    get,
    post,
    put,
    remove,
    http,
  };
};

export default useHttp;

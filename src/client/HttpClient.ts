import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { IAuthContext } from "../context/AuthContext";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";

enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
}

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Credentials": true,
  "X-Requested-With": "XMLHttpRequest",
};

const injectToken = (
  config: InternalAxiosRequestConfig,
  auth: IAuthContext
): InternalAxiosRequestConfig<any> => {
  try {
    if (config.headers && !config.headers["auth-token"]) {
      config.headers["auth-token"] = auth?.accessToken;
    }
    return config;
  } catch (error: any) {
    throw new Error(error);
  }
};

class Http {
  private instance: AxiosInstance | null = null;
  private get http(): AxiosInstance {
    return this.instance != null ? this.instance : this.initHttp(true);
  }
  private baseUrl = import.meta.env.PROD
    ? import.meta.env.VITE_BASE_URL_PRODUCTION
    : import.meta.env.VITE_BASE_URL_DEVELOPMENT;

  initHttp(isPrivate: boolean) {
    const { auth } = useAuth();

    const http = axios.create({
      baseURL: this.baseUrl,
      headers,
      withCredentials: isPrivate,
    });

    const refresh = useRefreshToken(http);

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
        return this.handleError(response);
      }
    );

    this.instance = http;
    return http;
  }

  request<T = any, R = AxiosResponse<T>>(
    config: AxiosRequestConfig
  ): Promise<R> {
    return this.http.request(config);
  }

  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.get<T, R>(url, config);
  }

  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.post<T, R>(url, data, config);
  }

  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.put<T, R>(url, data, config);
  }

  delete<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.delete<T, R>(url, config);
  }

  // Handle global app errors
  // We can handle generic app errors depending on the status code
  private handleError(error: any) {
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
}

export const http = new Http();

import { createContext, useState } from "react";

export interface IAccessToken {
  accessToken: string | null;
}

type AuthState = {
  auth: IAccessToken;
  setAuth: React.Dispatch<React.SetStateAction<IAccessToken>>;
};

interface IProviderProps {
  children?: any;
}

const AccessToken: IAccessToken = { accessToken: "" };

const AuthContext = createContext<AuthState>({} as any);

export const AuthProvider = ({ children }: IProviderProps) => {
  const [auth, setAuth] = useState<IAccessToken>(AccessToken);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

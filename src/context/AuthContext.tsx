import { createContext, FC, useState } from "react";

export interface IAuthContext {
  accessToken: string | null;
}

type t = {
  auth: IAuthContext;
  setAuth: React.Dispatch<React.SetStateAction<IAuthContext>>;
};
interface IProviderProps {
  children?: any;
}

const test: IAuthContext = { accessToken: "" };

const AuthContext = createContext<t>({} as any);

export const AuthProvider = ({ children }: IProviderProps) => {
  const [auth, setAuth] = useState<IAuthContext>(test);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

import {
  ArrowLeftOnRectangleIcon,
  AtSymbolIcon,
  ExclamationTriangleIcon,
  KeyIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { Link, Navigate, redirect } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ICreateLoginDTO } from "../../models/dto/user/ICreateLoginDTO";
import ActionButton from "../../ui/buttons/ActionButton";
import TextInput from "../../ui/inputs/TextInput";
import useAuthService from "../../hooks/service/useAuthService";
import gradient from "../../assets/gradient.svg";
import { AxiosResponse } from "axios";
import { IAccessToken } from "../../auth/context/AuthContext";
import { IApiError } from "../../models/responses/IApiError";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setAuth } = useAuth();
  const { loginUser } = useAuthService();

  const mutation = useMutation<
    AxiosResponse<IAccessToken, any>,
    AxiosResponse<IApiError, any>,
    ICreateLoginDTO,
    unknown
  >({
    mutationFn: (newUser: ICreateLoginDTO) => {
      return loginUser(newUser);
    },
    onSuccess: (data, variables, context) => {
      const accessToken = data.data.accessToken;
      setAuth({ accessToken: accessToken });
      setEmail("");
      setPassword("");
      redirect("/user/user-dashboard");
    },
  });

  if (mutation.isSuccess) {
    return <Navigate to={"/user/user-dashboard"}></Navigate>;
  }

  useEffect(() => {
    document.addEventListener("keyup", (ev: KeyboardEvent) =>
      onEnterPress(ev, isFormInvalid())
    );
    return () => {
      document.removeEventListener("keyup", (ev: KeyboardEvent) =>
        onEnterPress(ev, isFormInvalid())
      );
    };
  }, [email, password]);

  const isFormInvalid = () => {
    return email == "" || password == "";
  };

  function onEnterPress(event: KeyboardEvent, isValid: boolean) {
    console.log(isFormInvalid());
    // if (event.key == "Enter") {
    //   mutation.mutate({
    //     email: email,
    //     password: password,
    //   });
    // }
  }
  console.log(email);
  return (
    <>
      <div className="absolute bottom-0 left-0 z-10 flex w-full">
        <img src={gradient} alt="" className="w-full opacity-50" />
      </div>
      <div className="relative z-20 flex grow">
        <div className="flex w-full items-center justify-center p-4">
          <div className="flex h-max w-full flex-col  gap-6 pb-12 sm:w-2/3 md:w-[35rem] 2xl:w-2/3">
            <div className="flex h-max w-full flex-col rounded-lg border border-neutral-600 bg-neutral-800/50 p-4">
              <h1 className="m-0 mb-1 font-serif text-2xl font-bold tracking-wider">
                Welcome Back!
              </h1>
              <p className="m-0 font-sans text-sm text-neutral-500">
                Enter your email and password to sign into the system and start
                working!
              </p>
              <div className="mt-4 flex h-max w-full flex-wrap gap-4">
                <TextInput
                  name="email"
                  icon={<AtSymbolIcon className="m-0 w-5 p-0"></AtSymbolIcon>}
                  placeholder="Email.."
                  value={email}
                  onChange={(val) => setEmail(val)}
                  isRequred={true}
                  minLenght={6}
                ></TextInput>
                <TextInput
                  name="password"
                  icon={<KeyIcon className="m-0 w-4 p-0"></KeyIcon>}
                  placeholder="Password.."
                  value={password}
                  onChange={(val) => setPassword(val)}
                  isRequred={true}
                  minLenght={6}
                ></TextInput>
                {mutation.isError ? (
                  <div className="flex w-max items-center gap-2">
                    <ExclamationTriangleIcon className="w-6 text-red-700"></ExclamationTriangleIcon>{" "}
                    <p className="mt-0.5 text-lg text-neutral-500">
                      Wrong email or password
                    </p>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="w-full">
              <ActionButton
                color="indigo"
                isDisabled={isFormInvalid()}
                content={"SIGN IN"}
                onClick={() => {
                  mutation.mutate({
                    email: email,
                    password: password,
                  });
                }}
                icon={
                  <ArrowLeftOnRectangleIcon className="w-6 text-indigo-600"></ArrowLeftOnRectangleIcon>
                }
              ></ActionButton>
            </div>
            <div className="flex w-full justify-center">
              <p className="text-neutral-500">
                Don't have an account yet?
                <Link to={"../register"}>
                  <span className="ml-1 text-neutral-200/80 underline">
                    Register
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  AtSymbolIcon,
  KeyIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
import { ICreateLoginDTO } from "../../models/dto/user/ICreateLoginDTO";
import ActionButton from "../../ui/buttons/ActionButton";
import TextInput from "../../ui/inputs/TextInput";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { http } from "../../auth/client/HttpClient";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const client = http.initHttp(true);

  const mutation = useMutation({
    mutationFn: (newUser: ICreateLoginDTO) => {
      return client.post("http://localhost:4000/api/auth/login", newUser, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
    },
    onSuccess: (data, variables, context) => {
      const accessToken = data?.data.accessToken;
      setAuth({ accessToken });
      setEmail("");
      setPassword("");
      navigate("/user/user-dashboard", { replace: true });
    },
  });

  return (
    <div className="flex grow">
      <div className="flex w-full items-center justify-center">
        <div className="flex h-max w-1/3 flex-col gap-6 pb-12">
          <div className="flex h-max w-full flex-col rounded-xl border-2 border-neutral-600 bg-neutral-800/50 p-4">
            <h1 className="m-0 mb-1 font-serif text-2xl font-bold tracking-wider">
              Welcome Back!
            </h1>
            <p className="m-0 font-sans text-sm text-neutral-500">
              Enter your email and password to sign into the system and start
              working!
            </p>
            <div className="mt-4 flex h-max w-full flex-wrap gap-4">
              <TextInput
                icon={<AtSymbolIcon className="m-0 w-5 p-0"></AtSymbolIcon>}
                placeholder="Email.."
                value={email}
                onChange={(val) => setEmail(val)}
              ></TextInput>
              <TextInput
                icon={<KeyIcon className="m-0 w-4 p-0"></KeyIcon>}
                placeholder="Password.."
                value={password}
                onChange={(val) => setPassword(val)}
              ></TextInput>
            </div>
          </div>
          <div className="w-full">
            <ActionButton
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
  );
}

import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  AtSymbolIcon,
  KeyIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ICreateLoginDTO } from "../../models/dto/user/ICreateLoginDTO";
import ActionButton from "../../ui/buttons/ActionButton";
import TextInput from "../../ui/inputs/TextInput";
import { useNavigate } from "react-router-dom";
import useAuthService from "../../hooks/service/useAuthService";
import gradient from "../../assets/gradient.svg";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setAuth } = useAuth();
  const { loginUser } = useAuthService();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (newUser: ICreateLoginDTO) => {
      return loginUser(newUser);
    },
    onSuccess: (data, variables, context) => {
      const accessToken = data.data.accessToken;
      setAuth({ accessToken });
      setEmail("");
      setPassword("");
      navigate("/user/user-dashboard", { replace: true });
    },
  });

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
                ></TextInput>
                <TextInput
                  name="password"
                  icon={<KeyIcon className="m-0 w-4 p-0"></KeyIcon>}
                  placeholder="Password.."
                  value={password}
                  onChange={(val) => setPassword(val)}
                ></TextInput>
              </div>
            </div>
            <div className="w-full">
              <ActionButton
                color="indigo"
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
                <Link to={"/user/user-dashboard"}>
                  <span className="ml-1 text-neutral-200/80 underline">
                    test
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
function log(newUser: ICreateLoginDTO): Promise<unknown> {
  throw new Error("Function not implemented.");
}

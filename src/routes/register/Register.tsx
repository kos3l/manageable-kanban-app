import {
  AtSymbolIcon,
  CakeIcon,
  ExclamationTriangleIcon,
  IdentificationIcon,
  KeyIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Link, Navigate, redirect } from "react-router-dom";
import useAuthService from "../../hooks/service/useAuthService";
import { ICreateUserDTO } from "../../models/dto/user/ICreateUserDTO";
import ActionButton from "../../ui/buttons/ActionButton";
import DateInput from "../../ui/inputs/DateInput";
import TextInput from "../../ui/inputs/TextInput";
import { DateHelper } from "../../util/helpers/DateHelper";
import gradient from "../../assets/gradient.svg";
import { AxiosError, AxiosResponse } from "axios";
import { IRegisterUserResponse } from "../../models/responses/IRegisterUserResponse";
import { IApiError } from "../../models/responses/IApiError";

export default function RegisterPage() {
  const { registerUser } = useAuthService();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [birthday, setBirthday] = useState<Date>(new Date());
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const mutation = useMutation<
    AxiosResponse<IRegisterUserResponse, any>,
    AxiosResponse<IApiError, any>,
    ICreateUserDTO,
    unknown
  >({
    mutationFn: (newUser: ICreateUserDTO) => {
      return registerUser(newUser);
    },
  });

  if (mutation.isSuccess) {
    return <Navigate to={"/login"}></Navigate>;
  }

  const isFormInvalid = () => {
    return firstName == "" || lastName == "" || email == "" || password == "";
  };

  return (
    <>
      <div className="absolute bottom-0 left-0 z-10 flex w-full">
        <img src={gradient} alt="" className="w-full opacity-50" />
      </div>
      <div className="relative z-20 flex grow">
        <div className="flex w-full items-center justify-center p-4">
          <div className="flex h-max w-full flex-col gap-6 pb-12 sm:w-2/3 md:w-[35rem] 2xl:w-2/3">
            <div className="flex h-max w-full flex-col rounded-lg border border-neutral-600 bg-neutral-800/50 p-4">
              <h1 className="m-0 mb-1 font-serif text-2xl font-bold tracking-wider">
                Let's start!
              </h1>
              <p className="m-0 font-sans text-sm text-neutral-500">
                Create a new account for free.
              </p>
              <div className="mt-4 flex h-max w-full flex-wrap gap-4">
                <TextInput
                  icon={
                    <IdentificationIcon className="m-0 w-5 p-0"></IdentificationIcon>
                  }
                  isRequred={true}
                  placeholder="First Name.."
                  value={firstName}
                  onChange={(val) => setFirstName(val)}
                  name="firstName"
                  minLenght={3}
                ></TextInput>
                <TextInput
                  icon={
                    <IdentificationIcon className="m-0 w-5 p-0"></IdentificationIcon>
                  }
                  placeholder="Last Name.."
                  value={lastName}
                  isRequred={true}
                  onChange={(val) => setLastName(val)}
                  name="lastName"
                  minLenght={3}
                ></TextInput>
                <DateInput
                  icon={<CakeIcon className="m-0 w-5 p-0"></CakeIcon>}
                  value={DateHelper.formatDateToString(birthday, "YYYY-MM-DD")}
                  onChange={(val) => setBirthday(new Date(val))}
                  name="birthday"
                ></DateInput>
                <TextInput
                  icon={<AtSymbolIcon className="m-0 w-5 p-0"></AtSymbolIcon>}
                  placeholder="Email.."
                  value={email}
                  onChange={(val) => setEmail(val)}
                  name="email"
                  isRequred={true}
                  minLenght={6}
                ></TextInput>
                <TextInput
                  icon={<KeyIcon className="m-0 w-4 p-0"></KeyIcon>}
                  placeholder="Password.."
                  value={password}
                  onChange={(val) => setPassword(val)}
                  name="password"
                  isRequred={true}
                  minLenght={6}
                ></TextInput>
                {mutation.isError &&
                mutation.error.data.message == "Email already exists" ? (
                  <div className="flex w-max items-center gap-2">
                    <ExclamationTriangleIcon className="w-6 text-red-700"></ExclamationTriangleIcon>{" "}
                    <p className="mt-0.5 text-lg text-neutral-500">
                      Sorry, this email has been used already.
                    </p>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="w-full">
              <ActionButton
                isDisabled={isFormInvalid()}
                color={isFormInvalid() ? "white" : "indigo"}
                onClick={() => {
                  mutation.mutate({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    birthdate: birthday,
                  });
                }}
                content={"SIGN UP"}
                icon={
                  <UserPlusIcon
                    className={
                      isFormInvalid()
                        ? "w-5 text-neutral-300"
                        : "w-5 text-indigo-600"
                    }
                  ></UserPlusIcon>
                }
              ></ActionButton>
            </div>
            <div className="flex w-full justify-center">
              <p className="text-neutral-500">
                Already have an account?
                <Link to={"../login"}>
                  <span className="ml-1 text-neutral-200/80 underline">
                    Login
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
}

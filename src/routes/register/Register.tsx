import {
  AtSymbolIcon,
  CakeIcon,
  IdentificationIcon,
  KeyIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ICreateUserDTO } from "../../models/dto/user/ICreateUserDTO";
import ActionButton from "../../ui/buttons/ActionButton";
import DateInput from "../../ui/inputs/DateInput";
import TextInput from "../../ui/inputs/TextInput";
import { DateHelper } from "../../util/helpers/DateHelper";

export default function Register() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [birthday, setBirthday] = useState<Date>(new Date());
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  //   const query = useQuery("register", "https://manageableapi.onrender.com/");
  // console.log(firstName);
  // console.log(lastName);
  // console.log(birthday);
  // console.log(email);
  // console.log(password);
  const axiosPrivate = useAxiosPrivate();
  const mutation = useMutation({
    mutationFn: (newUser: ICreateUserDTO) => {
      return axios.post("http://localhost:4000/api/auth/register", newUser);
    },
  });
  const result = useQuery({
    queryKey: ["team"],
    queryFn: () => {
      return axiosPrivate.get("http://localhost:4000/api/team");
    },
  });

  return (
    <div className="flex grow">
      <div className="flex w-full items-center justify-center">
        <div className="flex h-max w-1/3 flex-col gap-6 pb-12">
          <div className="flex h-max w-full flex-col rounded-xl border-2 border-neutral-600 bg-neutral-800/50 p-4">
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
                placeholder="First Name.."
                value={firstName}
                onChange={(val) => setFirstName(val)}
              ></TextInput>
              <TextInput
                icon={
                  <IdentificationIcon className="m-0 w-5 p-0"></IdentificationIcon>
                }
                placeholder="Last Name.."
                value={lastName}
                onChange={(val) => setLastName(val)}
              ></TextInput>
              <DateInput
                icon={<CakeIcon className="m-0 w-5 p-0"></CakeIcon>}
                value={DateHelper.formatDateToString(birthday, "YYYY-MM-DD")}
                onChange={(val) => setBirthday(new Date(val))}
              ></DateInput>
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
                <UserPlusIcon className="w-5 text-indigo-600"></UserPlusIcon>
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
    </div>
  );
}

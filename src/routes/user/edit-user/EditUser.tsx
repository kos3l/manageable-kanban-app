import {
  Bars3CenterLeftIcon,
  CakeIcon,
  CheckCircleIcon,
  IdentificationIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { QueryClient, useMutation, useQueryClient } from "react-query";
import {
  Form,
  redirect,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import useUserService from "../../../hooks/service/useUserService";
import { IUpdateUserDTO } from "../../../models/dto/user/IUpdateUserDTO";
import { User } from "../../../models/entities/User";
import ActionButton from "../../../ui/buttons/ActionButton";
import DateInput from "../../../ui/inputs/DateInput";
import TextareaInput from "../../../ui/inputs/TextareaInput";
import TextInput from "../../../ui/inputs/TextInput";
import { DateHelper } from "../../../util/helpers/DateHelper";

export const action =
  (
    queryClient: QueryClient,
    updateUser: (
      userId: string,
      userDto: IUpdateUserDTO
    ) => Promise<AxiosResponse<void, any>>
  ) =>
  async ({ request, params }: any) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    await updateUser(params.id, updates);
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    return redirect(`/user/${params.id}`);
  };

export default function EditUser() {
  const user = useRouteLoaderData("userRoot") as User;
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState<string>(user.firstName);
  const [lastName, setLastName] = useState<string>(user.lastName);
  const [birthdate, setBirthdate] = useState<Date>(user.birthdate);
  const [bio, setBio] = useState<string>(user.bio ? user.bio : "");

  return (
    <div className="flex w-full justify-center md:justify-start 2xl:justify-center">
      <div className="flex h-max max-h-full w-full flex-col gap-3 md:w-3/6 xl:w-1/3">
        <div className="flex h-max w-full flex-col gap-3 rounded-lg border border-neutral-600 p-3">
          <h1 className="font-serif text-lg tracking-wider">Edit User</h1>
          <Form method="post">
            <TextInput
              icon={
                <IdentificationIcon className="m-0 w-5 p-0"></IdentificationIcon>
              }
              placeholder="First Name.."
              value={firstName}
              onChange={(val) => setFirstName(val)}
              name="firstName"
            ></TextInput>
            <TextInput
              icon={
                <IdentificationIcon className="m-0 w-5 p-0"></IdentificationIcon>
              }
              placeholder="Last Name.."
              name="lastName"
              value={lastName}
              onChange={(val) => setLastName(val)}
            ></TextInput>
            <DateInput
              icon={<CakeIcon className="m-0 w-5 p-0"></CakeIcon>}
              value={DateHelper.formatDateToString(birthdate, "YYYY-MM-DD")}
              onChange={(val) => setBirthdate(new Date(val))}
              name="birthdate"
            ></DateInput>
            <TextareaInput
              icon={
                <Bars3CenterLeftIcon className="m-0 w-4 p-0"></Bars3CenterLeftIcon>
              }
              placeholder="Bio.."
              value={bio}
              onChange={(val) => setBio(val)}
              name="bio"
            ></TextareaInput>
            <button type="submit">pls</button>
          </Form>
        </div>
        <ActionButton
          content={"Save"}
          color="indigo"
          onClick={() => {
            //   firstName: firstName,
            //   lastName: lastName,
            //   birthdate: birthdate,
            //   bio: bio,
          }}
          icon={
            <CheckCircleIcon className="w-5 text-indigo-500"></CheckCircleIcon>
          }
        ></ActionButton>

        <ActionButton
          onClick={() => navigate(-1)}
          content={"Cancel"}
          color="red"
          icon={<XMarkIcon className="w-5 text-red-600"></XMarkIcon>}
        ></ActionButton>
      </div>
    </div>
  );
}

import {
  Bars3CenterLeftIcon,
  CakeIcon,
  CheckCircleIcon,
  IdentificationIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import { QueryClient } from "react-query";
import {
  Form,
  redirect,
  useNavigate,
  useRouteLoaderData,
  useSubmit,
} from "react-router-dom";
import { IUpdateUserDTO } from "../../models/dto/user/IUpdateUserDTO";
import { User } from "../../models/entities/User";
import QueryKeys from "../../static/QueryKeys";
import ActionButton from "../../ui/buttons/ActionButton";
import DateInput from "../../ui/inputs/DateInput";
import TextareaInput from "../../ui/inputs/TextareaInput";
import TextInput from "../../ui/inputs/TextInput";
import { DateHelper } from "../../util/helpers/DateHelper";

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
    const updates = Object.fromEntries(formData) as IUpdateUserDTO;
    if (updates.bio == "" || !updates.bio) {
      delete updates.bio;
    }
    await updateUser(params.id, updates);
    await queryClient.invalidateQueries({
      queryKey: QueryKeys.userProfile,
    });
    return redirect(`/user/profile/${params.id}`);
  };

export default function EditUserPage() {
  const user = useRouteLoaderData("userRoot") as User;
  const formRef = useRef<any>();
  const navigate = useNavigate();
  const submit = useSubmit();

  const [firstName, setFirstName] = useState<string>(user.firstName);
  const [lastName, setLastName] = useState<string>(user.lastName);
  const [birthdate, setBirthdate] = useState<Date>(user.birthdate);
  const [bio, setBio] = useState<string>(user.bio ? user.bio : "");

  useEffect(() => {
    document.addEventListener("keyup", onEnterPress);
    return () => {
      document.removeEventListener("keyup", onEnterPress);
    };
  }, [firstName, lastName, bio]);

  function onEnterPress(event: KeyboardEvent) {
    if (event.key == "Enter" && !isFormInvalid()) {
      submit(formRef.current);
    }
  }

  const isFormInvalid = () => {
    return firstName == "" || lastName == "" || bio == "";
  };

  return (
    <div className="flex w-full justify-center bg-gradient-to-b from-neutral-900 p-4 md:justify-start 2xl:justify-center">
      <Form
        ref={formRef}
        method="post"
        className="flex h-max max-h-full w-full flex-col gap-3 md:w-3/6 xl:w-1/3"
      >
        <div className="flex h-max w-full flex-col gap-3 rounded-lg border border-neutral-600 bg-neutral-800/50 p-3">
          <h1 className="font-serif text-lg tracking-wider">Edit User</h1>
          <TextInput
            icon={
              <IdentificationIcon className="m-0 w-5 p-0"></IdentificationIcon>
            }
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
            name="lastName"
            value={lastName}
            onChange={(val) => setLastName(val)}
            minLenght={3}
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
            minLenght={6}
          ></TextareaInput>
        </div>
        <div className="flex gap-2">
          <ActionButton
            content={"Save"}
            color={isFormInvalid() ? "white" : "indigo"}
            isSubmitBtn
            isDisabled={isFormInvalid()}
            icon={
              <CheckCircleIcon
                className={
                  isFormInvalid()
                    ? "w-5 text-neutral-300"
                    : "w-5 text-indigo-500"
                }
              ></CheckCircleIcon>
            }
          ></ActionButton>
          <ActionButton
            onClick={() => navigate(-1)}
            content={"Cancel"}
            color="red"
            icon={<XMarkIcon className="w-5 text-red-600"></XMarkIcon>}
          ></ActionButton>
        </div>
      </Form>
    </div>
  );
}

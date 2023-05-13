import {
  IdentificationIcon,
  Bars3CenterLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { QueryClient } from "react-query";
import { Form, redirect, useNavigate } from "react-router-dom";
import { ICreateTeamDTO } from "../../models/dto/team/ICreateTeamDTO";
import { Team } from "../../models/entities/Team";
import ActionButton from "../../ui/buttons/ActionButton";
import TextareaInput from "../../ui/inputs/TextareaInput";
import TextInput from "../../ui/inputs/TextInput";

export const action =
  (
    queryClient: QueryClient,
    createTeam: (teamDto: ICreateTeamDTO) => Promise<AxiosResponse<Team, any>>
  ) =>
  async ({ request }: any) => {
    const formData = await request.formData();
    const team = Object.fromEntries(formData) as ICreateTeamDTO;
    const newTeam = await createTeam(team);
    await queryClient.invalidateQueries({
      queryKey: ["team", "teams", "projects", "profile"],
    });
    return redirect(`/user/teams/${newTeam.data._id}`);
  };

export default function CreateTeam() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  return (
    <div className="flex w-full justify-center md:justify-start 2xl:justify-center">
      <Form
        method="post"
        className="flex h-max max-h-full w-full flex-col gap-3 md:w-3/6 xl:w-1/3"
      >
        <div className="flex h-max w-full flex-col gap-3 rounded-lg border border-neutral-600 bg-neutral-800/50 p-3">
          <h1 className="font-serif text-lg tracking-wider">Create New Team</h1>
          <TextInput
            icon={
              <IdentificationIcon className="m-0 w-5 p-0"></IdentificationIcon>
            }
            placeholder="Name.."
            value={name}
            onChange={(val) => setName(val)}
            name="name"
          ></TextInput>
          <TextareaInput
            icon={
              <Bars3CenterLeftIcon className="m-0 w-4 p-0"></Bars3CenterLeftIcon>
            }
            placeholder="Description.."
            value={description}
            onChange={(val) => setDescription(val)}
            name="description"
          ></TextareaInput>
        </div>
        <ActionButton
          content={"Save"}
          color="indigo"
          isSubmitBtn
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
      </Form>
    </div>
  );
}
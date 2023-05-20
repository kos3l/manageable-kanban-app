import {
  IdentificationIcon,
  Bars3CenterLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import { QueryClient } from "react-query";
import { Form, redirect, useNavigate, useSubmit } from "react-router-dom";
import { ICreateTeamDTO } from "../../models/dto/team/ICreateTeamDTO";
import { Team } from "../../models/entities/Team";
import QueryKeys from "../../static/QueryKeys";
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
      queryKey: QueryKeys.userProfile,
    });
    await queryClient.invalidateQueries({
      queryKey: QueryKeys.allTeams,
    });
    await queryClient.invalidateQueries({
      queryKey: QueryKeys.projectsWithTeams,
    });
    return redirect(`/user/teams/${newTeam.data._id}`);
  };

export default function CreateTeam() {
  const navigate = useNavigate();
  const formRef = useRef<any>();
  const submit = useSubmit();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    document.addEventListener("keyup", onEnterPress);
    return () => {
      document.removeEventListener("keyup", onEnterPress);
    };
  }, [name, description]);

  function onEnterPress(event: KeyboardEvent) {
    if (event.key == "Enter" && !isFormInvalid()) {
      submit(formRef.current);
    }
  }

  const isFormInvalid = () => {
    return name == "" || description == "";
  };

  return (
    <div className="flex w-full justify-center bg-gradient-to-b from-neutral-900 p-4 md:justify-start 2xl:justify-center">
      <Form
        ref={formRef}
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
            isRequred={true}
            minLenght={2}
          ></TextInput>
          <TextareaInput
            icon={
              <Bars3CenterLeftIcon className="m-0 w-4 p-0"></Bars3CenterLeftIcon>
            }
            placeholder="Description.."
            value={description}
            onChange={(val) => setDescription(val)}
            name="description"
            minLenght={3}
          ></TextareaInput>
        </div>
        <div className="flex gap-2">
          <ActionButton
            content={"Save"}
            isSubmitBtn
            color={isFormInvalid() ? "white" : "indigo"}
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

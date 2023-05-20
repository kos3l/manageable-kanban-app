import {
  IdentificationIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
  PlusIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/solid";
import Bars3CenterLeftIcon from "@heroicons/react/24/solid/Bars3CenterLeftIcon";
import { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import { QueryClient, useQuery } from "react-query";
import { Form, redirect, useNavigate, useSubmit } from "react-router-dom";
import useTeamService from "../../hooks/service/useTeamService";
import { ICreateProjectDTO } from "../../models/dto/project/ICreateProjectDTO";
import { Team } from "../../models/entities/Team";
import QueryKeys from "../../static/QueryKeys";
import ActionButton from "../../ui/buttons/ActionButton";
import ActionInput from "../../ui/inputs/ActionInput";
import DateInput from "../../ui/inputs/DateInput";
import TextareaInput from "../../ui/inputs/TextareaInput";
import TextInput from "../../ui/inputs/TextInput";
import Dropdown from "../../ui/selection/Dropdown";
import { DateHelper } from "../../util/helpers/DateHelper";

const getAllTeams = (
  getAllUserTeams: () => Promise<AxiosResponse<Team[], any>>
) => ({
  queryKey: QueryKeys.allTeams,
  queryFn: async () => {
    const response = await getAllUserTeams();
    if (response.status == 401 || response.status == 403) {
      throw new Error("Token expired");
    }

    return response.data;
  },
});

export const action =
  (
    queryClient: QueryClient,
    createProject: (
      teamDto: ICreateProjectDTO
    ) => Promise<AxiosResponse<Team, any>>
  ) =>
  async ({ request }: any) => {
    const formData = await request.formData();
    let project = Object.fromEntries(formData);
    const techStack = project.techStack;
    project.techStack = JSON.parse(techStack);
    const newProject = await createProject(project as ICreateProjectDTO);
    await queryClient.invalidateQueries({
      queryKey: QueryKeys.userProfile,
    });
    await queryClient.invalidateQueries({
      queryKey: QueryKeys.allTeams,
    });
    await queryClient.invalidateQueries({
      queryKey: QueryKeys.projectsWithTeams,
    });
    return redirect(`/user/projects/${newProject.data._id}`);
  };

export default function CreateProject() {
  const { getAllUserTeams } = useTeamService();
  const navigate = useNavigate();
  const formRef = useRef<any>();
  const submit = useSubmit();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [team, setTeam] = useState<Team>();
  const [newTech, setNewTech] = useState<string>("");

  const { data: teams } = useQuery(getAllTeams(getAllUserTeams));

  function handleAddNewTech() {
    const createdTech = newTech;
    if (techStack.length > 0) {
      setTechStack([...techStack, createdTech]);
    } else {
      setTechStack([createdTech]);
    }
    setNewTech("");
  }

  useEffect(() => {
    document.addEventListener("keyup", onEnterPress);
    return () => {
      document.removeEventListener("keyup", onEnterPress);
    };
  }, [name, description, techStack, endDate, startDate]);

  function onEnterPress(event: KeyboardEvent) {
    if (event.key == "Enter" && !isFormInvalid()) {
      submit(formRef.current);
    }
  }

  const isFormInvalid = () => {
    return (
      name == "" ||
      description == "" ||
      techStack.length == 0 ||
      team == null ||
      startDate >= endDate
    );
  };

  return (
    <div className="flex w-full justify-center bg-gradient-to-b from-neutral-900 p-4 md:justify-start 2xl:justify-center">
      <Form
        ref={formRef}
        method="post"
        className="flex h-max max-h-full w-full flex-col gap-3  xl:w-5/6"
      >
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="flex h-max w-full flex-col gap-3 rounded-lg border border-neutral-600 bg-neutral-800/50 p-3">
            <h1 className="font-serif text-lg tracking-wider">
              Create New Project
            </h1>
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
            <div className="flex w-full flex-wrap gap-2 lg:flex-nowrap">
              <div className="flex grow">
                <DateInput
                  icon={<ClockIcon className="m-0 w-5 p-0"></ClockIcon>}
                  onChange={(newVal) => setStartDate(new Date(newVal))}
                  name={"startDate"}
                  value={DateHelper.formatDateToString(startDate, "YYYY-MM-DD")}
                ></DateInput>
              </div>
              <div className="flex grow">
                <DateInput
                  icon={
                    <CheckCircleIcon className="m-0 w-5 p-0"></CheckCircleIcon>
                  }
                  onChange={(newVal) => setEndDate(new Date(newVal))}
                  name={"endDate"}
                  value={DateHelper.formatDateToString(endDate, "YYYY-MM-DD")}
                ></DateInput>
              </div>
            </div>
            {teams ? (
              <Dropdown
                icon={
                  <ChevronUpDownIcon className="w-4 text-indigo-600"></ChevronUpDownIcon>
                }
                value={team}
                onSelectValue={(val) => setTeam(val)}
                dropdownValues={teams}
                placeholder="Select a team.."
                color={"indigo"}
                displayProperty="name"
              ></Dropdown>
            ) : (
              <></>
            )}
            <input type="hidden" name="teamId" value={team ? team._id : ""} />
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
          <div className="flex h-max w-full flex-col gap-3 rounded-lg border border-neutral-600 bg-neutral-800/50 p-3">
            <div>
              <p className="font-serif text-lg tracking-wider">Tools</p>
              <p className="text-sm text-neutral-600">
                A list of all solutions, technologies and tools used to work on
                this project.
              </p>
            </div>
            <ActionInput
              icon={
                <PlusIcon className="m-0 w-5 p-0 text-indigo-500"></PlusIcon>
              }
              placeholder="Add more to the stack.."
              value={newTech}
              onChange={(val) => setNewTech(val)}
              onClick={() => handleAddNewTech()}
            ></ActionInput>
            <input
              type="hidden"
              name="techStack"
              value={JSON.stringify(techStack)}
            />
            {techStack && techStack.length > 0 ? (
              <div className="mt-2 flex h-max w-full flex-wrap gap-2 rounded-lg border border-neutral-600 bg-neutral-900 p-2">
                <>
                  {techStack.map((tech, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() =>
                          setTechStack(
                            techStack.filter(
                              (techFromState) => techFromState !== tech
                            )
                          )
                        }
                        className="w-max cursor-pointer rounded border border-pink-500 bg-pink-600/30 px-3"
                      >
                        <p className="mt-1 text-pink-500">{tech}</p>{" "}
                      </div>
                    );
                  })}
                </>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex w-full gap-2 md:w-96">
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
          ></ActionButton>{" "}
        </div>
      </Form>
    </div>
  );
}

import {
  IdentificationIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import Bars3CenterLeftIcon from "@heroicons/react/24/solid/Bars3CenterLeftIcon";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { QueryClient } from "react-query";
import {
  Form,
  redirect,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import { IUpdateProjectDTO } from "../../models/dto/project/IUpdateProjectDTO";
import { Project } from "../../models/entities/Project";
import ActionButton from "../../ui/buttons/ActionButton";
import DisplayField from "../../ui/display-field/DisplayField";
import ActionInput from "../../ui/inputs/ActionInput";
import DateInput from "../../ui/inputs/DateInput";
import TextareaInput from "../../ui/inputs/TextareaInput";
import TextInput from "../../ui/inputs/TextInput";
import { DateHelper } from "../../util/helpers/DateHelper";

export const action =
  (
    queryClient: QueryClient,
    updateProject: (
      projectId: string,
      projectDto: IUpdateProjectDTO
    ) => Promise<AxiosResponse<void, any>>
  ) =>
  async ({ request, params }: any) => {
    const formData = await request.formData();
    let project = Object.fromEntries(formData);
    const techStack = project.techStack;
    project.techStack = JSON.parse(techStack);
    await updateProject(params.id, project as IUpdateProjectDTO);
    await queryClient.invalidateQueries({
      queryKey: ["team", "teams", "projects", "profile"],
    });
    return redirect(`/user/projects-overview`);
  };

export default function EditProjectPage() {
  const project = useRouteLoaderData("selectedProject") as Project;
  const [name, setName] = useState<string>(project.name);
  const [description, setDescription] = useState<string>(
    project.description ? project.description : ""
  );
  const [techStack, setTechStack] = useState<string[]>(project.techStack);
  const [endDate, setEndDate] = useState<Date>(project.endDate);
  const [newTech, setNewTech] = useState<string>("");
  const navigate = useNavigate();

  function handleAddNewTech() {
    const createdTech = newTech;
    if (techStack.length > 0) {
      setTechStack([...techStack, createdTech]);
    } else {
      setTechStack([createdTech]);
    }
    setNewTech("");
  }

  return (
    <div className="flex w-full justify-center p-4 md:justify-start 2xl:justify-center">
      <Form
        method="post"
        className="flex h-max max-h-full w-full flex-col gap-3  xl:w-5/6"
      >
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="flex h-max w-full flex-col gap-3 rounded-lg border border-neutral-600 bg-neutral-800/50 p-3">
            <div>
              <h1 className="mb-1 font-serif text-lg tracking-wider">
                Edit Project
              </h1>
              <DisplayField
                color="white"
                label={"Start Date"}
                placeholder={"Date not found"}
                value={new Date(project.startDate).toLocaleDateString()}
                icon={<ClockIcon className="w-6 text-neutral-300"></ClockIcon>}
              ></DisplayField>
            </div>
            <TextInput
              icon={
                <IdentificationIcon className="m-0 w-5 p-0"></IdentificationIcon>
              }
              placeholder="Name.."
              value={name}
              onChange={(val) => setName(val)}
              name="name"
            ></TextInput>
            <div className="flex w-full flex-wrap gap-2 lg:flex-nowrap">
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
          ></ActionButton>{" "}
        </div>
      </Form>
    </div>
  );
}

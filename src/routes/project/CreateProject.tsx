import {
  IdentificationIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Bars3CenterLeftIcon from "@heroicons/react/24/solid/Bars3CenterLeftIcon";
import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { Team } from "../../models/entities/Team";
import ActionButton from "../../ui/buttons/ActionButton";
import DateInput from "../../ui/inputs/DateInput";
import TextareaInput from "../../ui/inputs/TextareaInput";
import TextInput from "../../ui/inputs/TextInput";
import { DateHelper } from "../../util/helpers/DateHelper";

export default function CreateProject() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [team, setTeam] = useState<Team>();
  const [newTech, setNewTech] = useState<string>("");
  const navigate = useNavigate();

  return (
    <div className="flex w-full justify-center md:justify-start 2xl:justify-center">
      <Form
        method="post"
        className="flex h-max max-h-full w-full flex-col gap-3 md:w-3/6 xl:w-5/6"
      >
        <div className="flex w-full gap-4">
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
            ></TextInput>
            <div className="flex w-full gap-2">
              <div className="flex grow">
                <DateInput
                  icon={
                    <IdentificationIcon className="m-0 w-5 p-0"></IdentificationIcon>
                  }
                  onChange={(newVal) => setStartDate(new Date(newVal))}
                  name={"startDate"}
                  value={DateHelper.formatDateToString(startDate, "YYYY-MM-DD")}
                ></DateInput>
              </div>
              <div className="flex grow">
                <DateInput
                  icon={
                    <IdentificationIcon className="m-0 w-5 p-0"></IdentificationIcon>
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
            <p className="font-serif text-lg tracking-wider">Tech Stack</p>
            <TextInput
              icon={
                <IdentificationIcon className="m-0 w-5 p-0"></IdentificationIcon>
              }
              placeholder="Add more to the stack.."
              value={newTech}
              onChange={(val) => setNewTech(val)}
            ></TextInput>
          </div>
          <div></div>
        </div>
        <div className="flex w-96 gap-2">
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

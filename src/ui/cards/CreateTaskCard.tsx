import {
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  TagIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { ICreateTaskDTO } from "../../models/dto/task/ICreateTaskDTO";
import { Column } from "../../models/entities/Column";
import { Project } from "../../models/entities/Project";
import { DateHelper } from "../../util/helpers/DateHelper";
import ActionButton from "../buttons/ActionButton";
import DateInput from "../inputs/DateInput";
import TextInput from "../inputs/TextInput";

interface IProps {
  column: Column;
  project: Project;
  createTask: (newVal: ICreateTaskDTO) => void;
  showCreate: boolean;
  onClose: () => void;
}

export default function CreateTaskCard(props: IProps) {
  const { column, project, createTask, showCreate, onClose } = props;
  const mainRef = useRef<any>(null);

  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date(project.startDate));
  const [endDate, setEndDate] = useState<Date>(
    DateHelper.addOneDay(project.startDate)
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (mainRef.current && !mainRef.current.contains(event.target)) {
      onClose();
      clearState();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("keyup", onEnterPress);
    return () => {
      document.removeEventListener("keyup", onEnterPress);
    };
  }, [title, startDate, endDate]);

  function clearState() {
    setTitle("");
    setStartDate(new Date(project.startDate));
    setEndDate(DateHelper.addOneDay(project.startDate));
  }

  function onEnterPress(event: KeyboardEvent) {
    if (event.key == "Enter" && !isCreatetaskInvalid()) {
      createTask({
        title: title,
        startDate: startDate,
        endDate: endDate,
        columnId: column._id,
      });
      clearState();
      onClose();
    }
  }

  const isCreatetaskInvalid = () => {
    return (
      title == "" ||
      startDate >= endDate ||
      startDate < new Date(project.startDate) ||
      endDate > new Date(project.endDate)
    );
  };

  return (
    <>
      {showCreate ? (
        <div
          ref={mainRef}
          className="flex w-full flex-col gap-2 rounded-lg border border-neutral-600 bg-neutral-800/30 p-2"
        >
          <TextInput
            placeholder={"Title.."}
            value={title}
            icon={<TagIcon className="w-5 text-neutral-300"></TagIcon>}
            onChange={(newVal) => setTitle(newVal)}
            name="title"
            isRequred={true}
            minLenght={2}
          ></TextInput>
          <DateInput
            icon={<ClockIcon className="w-5 text-neutral-300"></ClockIcon>}
            onChange={(newVal) => setStartDate(new Date(newVal))}
            value={DateHelper.formatDateToString(startDate, "YYYY-MM-DD")}
            name={"startDate"}
          ></DateInput>
          <input type="hidden" value={column._id} name="columnId" />
          <DateInput
            icon={
              <CheckCircleIcon className="w-5 text-neutral-300"></CheckCircleIcon>
            }
            onChange={(newVal) => setEndDate(new Date(newVal))}
            value={DateHelper.formatDateToString(endDate, "YYYY-MM-DD")}
            name={"endDate"}
          ></DateInput>
          <div className="flex h-max w-full gap-2">
            <div className="grow">
              <ActionButton
                content={"Save"}
                isSmaller={true}
                onClick={() => {
                  createTask({
                    title: title,
                    startDate: startDate,
                    endDate: endDate,
                    columnId: column._id,
                  });
                  clearState();
                }}
                color={isCreatetaskInvalid() ? "white" : "indigo"}
                isDisabled={isCreatetaskInvalid()}
                icon={
                  <CheckIcon
                    className={
                      isCreatetaskInvalid()
                        ? "w-5 text-neutral-300"
                        : "w-5 text-indigo-500"
                    }
                  ></CheckIcon>
                }
              ></ActionButton>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

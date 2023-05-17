import { CheckCircleIcon, ClockIcon, TagIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { ICreateTaskDTO } from "../../models/dto/task/ICreateTaskDTO";
import { Column } from "../../models/entities/Column";
import { Project } from "../../models/entities/Project";
import { DateHelper } from "../../util/helpers/DateHelper";
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

  function clearState() {
    setTitle("");
    setStartDate(new Date(project.startDate));
    setStartDate(DateHelper.addOneDay(project.startDate));
  }

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
              <button
                onClick={() => {
                  createTask({
                    title: title,
                    startDate: startDate,
                    endDate: endDate,
                    columnId: column._id,
                  });
                  clearState();
                }}
                className="w-full rounded border border-transparent bg-indigo-800/30 py-1.5 px-3 text-sm text-indigo-500 transition hover:border-indigo-600"
              >
                <p className="mt-0.5 tracking-wider">SAVE</p>
              </button>
            </div>
            <div className="grow">
              <button
                onClick={() => {
                  onClose(), clearState();
                }}
                className="w-full rounded border border-transparent bg-neutral-800/60 py-1.5 px-3 text-sm text-neutral-500 transition hover:border-neutral-400"
              >
                <p className="mt-0.5 tracking-wider">CANCEL</p>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

import {
  PencilSquareIcon,
  XMarkIcon,
  BellIcon,
  BellAlertIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { Task } from "../../models/entities/Task";
import DisplayField from "../display-field/DisplayField";
import avatar from "../../assets/avatar.png";
import { useRef, useEffect } from "react";

interface IProps {
  selectedTask: Task;
  onClose: () => void;
}

export default function SelectedtTaskCard(props: IProps) {
  const { selectedTask, onClose } = props;
  const mainRef = useRef<any>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (mainRef.current && !mainRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={mainRef}
      className="relative flex h-max w-[95vw] flex-col overflow-scroll rounded-lg border border-neutral-700 bg-neutral-900 pb-4 md:w-[550px] lg:w-[700px] 2xl:w-1/2"
    >
      <div className="h-44 w-full bg-pink-900/20"></div>
      <div className="flex w-full flex-col gap-3 p-4">
        <div className="flex w-full items-start justify-between gap-2">
          <p className="max-w-2/4 break-all font-serif text-xl tracking-wider">
            {selectedTask.title}
          </p>
          <div className="flex justify-end gap-2">
            <button className="flex w-max items-center gap-1 rounded bg-indigo-600/20 py-1 px-2 transition hover:bg-indigo-600/40">
              <PencilSquareIcon className="w-4 rounded text-indigo-600"></PencilSquareIcon>
              <p className="mt-0.5 text-sm tracking-wider text-indigo-500">
                Edit
              </p>
            </button>
            <button className="flex w-max items-center gap-1 rounded bg-red-900/20 py-1 px-2 transition hover:bg-red-900/40">
              <TrashIcon className="w-4 rounded text-red-800"></TrashIcon>
              <p className="mt-0.5 text-sm tracking-wider text-red-800">
                Delete
              </p>
            </button>
            <button
              onClick={() => onClose()}
              className="flex w-max  min-w-[2rem] items-center justify-center rounded bg-neutral-700/40 p-1 transition hover:bg-neutral-700/60"
            >
              <XMarkIcon className="w-5 rounded text-neutral-400"></XMarkIcon>
            </button>
          </div>
        </div>
        <div className="flex w-max gap-4">
          <DisplayField
            color="white"
            label={"Start Date"}
            placeholder={"Date not found"}
            value={new Date(selectedTask.startDate).toLocaleDateString()}
            icon={<BellIcon className="w-6 text-neutral-300"></BellIcon>}
          ></DisplayField>
          <DisplayField
            color={
              new Date() > new Date(selectedTask.endDate) ? "red" : "white"
            }
            label={"End Date"}
            placeholder={"Date not found"}
            icon={
              <BellAlertIcon
                className={
                  new Date() > new Date(selectedTask.endDate)
                    ? "w-6 text-red-700"
                    : "w-6 text-neutral-300"
                }
              ></BellAlertIcon>
            }
            value={new Date(selectedTask.endDate).toLocaleDateString()}
          ></DisplayField>
        </div>
        <div className="mt-2 flex h-max w-full gap-2">
          <div className="mr-1 flex grow border-r border-neutral-600 pr-2">
            <DisplayField
              color="white"
              label="Description"
              value={selectedTask.description}
              placeholder={"No Description"}
            ></DisplayField>
          </div>
          <div className="flex basis-[11rem] flex-col leading-4">
            <p className="text-xs tracking-wider text-neutral-500">
              Assigned members
            </p>
            {selectedTask.users && selectedTask.users.length > 0 ? (
              <div className="mt-1 flex w-full flex-col">
                {selectedTask.users.map((user) => {
                  return (
                    <Link to={"/users/profile/" + user._id}>
                      <div
                        key={user._id}
                        className={
                          "flex h-max w-full max-w-[10rem] items-center justify-between gap-2 overflow-scroll  transition hover:text-pink-500"
                        }
                      >
                        <div className="flex grow gap-2 truncate">
                          <div className="basis-7 overflow-hidden rounded-lg">
                            <img
                              src={avatar}
                              alt=""
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <p className="mt-2 grow truncate">
                            <span className="opacity-70">
                              {user.firstName + " " + user.lastName}
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-neutral-700">No users added..</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

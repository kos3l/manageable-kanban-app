import { BellIcon } from "@heroicons/react/24/solid";
import { Task } from "../../models/entities/Task";
import avatar from "../../assets/avatar.png";
import LabelCard from "./LabelCard";
import { Link } from "react-router-dom";

interface IProps {
  task: Task;
}

export default function StaticTaskCard(props: IProps) {
  const { task } = props;

  return (
    <Link to={"/user/projects/" + task.projectId + "/kanban"}>
      <div className="relative h-max w-full">
        <div className="h-max w-full cursor-grab gap-2 rounded-lg border border-neutral-600 bg-neutral-800/60 p-2 transition hover:border-neutral-400">
          {task.labels && task.labels.length > 0 ? (
            <div className="mb-2 flex h-max w-full flex-wrap items-center gap-2">
              {task.labels.map((label, index) => (
                <LabelCard label={label} key={index}></LabelCard>
              ))}
            </div>
          ) : (
            <></>
          )}
          <div className="flex h-max w-full items-center gap-2">
            <div
              className={
                new Date() > new Date(task.endDate)
                  ? "flex h-7 w-7 items-center justify-center rounded-md bg-red-900/30"
                  : "flex h-7 w-7 items-center justify-center rounded-md bg-neutral-600/70"
              }
            >
              <BellIcon
                className={
                  new Date() > new Date(task.endDate)
                    ? "w-4 text-red-700"
                    : "w-4"
                }
              ></BellIcon>
            </div>
            <div className="break-word flex h-max flex-col">
              <p className="mt-1 text-base leading-4 tracking-wider opacity-80 ">
                {new Date(task.startDate).toLocaleDateString(undefined, {
                  month: "numeric",
                  day: "numeric",
                }) +
                  " - " +
                  new Date(task.endDate).toLocaleDateString(undefined, {
                    month: "numeric",
                    day: "numeric",
                  })}
              </p>
            </div>
          </div>
          <div className="word-break mt-2 flex h-max w-full cursor-pointer flex-col leading-4">
            <p className="break-all font-serif text-base">{task.title}</p>
          </div>
          {task.users && task.users.length > 0 ? (
            <div className="mt-1.5 flex w-full flex-wrap gap-2">
              {task.users.map((user, index) => {
                return (
                  <div
                    key={index}
                    className="basis-7 overflow-hidden rounded-lg"
                  >
                    <img
                      src={avatar}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </div>
                );
              })}{" "}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Link>
  );
}

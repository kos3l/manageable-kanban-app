import { BellIcon } from "@heroicons/react/24/solid";
import { Task } from "../../models/entities/Task";

interface IProps {
  task: Task;
}

export default function TaskCard(props: IProps) {
  const { task } = props;

  return (
    <div className="h-max w-full cursor-pointer gap-2 rounded-lg border border-neutral-600 bg-neutral-800/60 p-2">
      <div></div>
      <div className="flex h-max w-full items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-600/70">
          <BellIcon className="w-4"></BellIcon>
        </div>
        <div className="break-word flex h-max flex-col">
          <p className="mt-1 text-base leading-4 tracking-wider ">
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
      <div className="word-break mt-2 flex h-max w-full flex-col leading-4">
        <p className="break-all font-serif text-base">{task.title}</p>
      </div>
      <div></div>
    </div>
  );
}

import { Task } from "../../models/entities/Task";
import StaticTaskCard from "./StaticTaskCard";

interface IProps {
  tasks: Task[];
  title: string;
}

export default function TaskListCard(props: IProps) {
  const { tasks, title } = props;

  return (
    <div
      className={
        tasks.length > 0
          ? "flex h-60 w-full flex-col justify-start gap-2 rounded-lg border border-neutral-600 bg-neutral-800/30 p-3"
          : "flex h-max w-full flex-col justify-center gap-2 rounded-lg border border-neutral-600 bg-neutral-800/30 p-3"
      }
    >
      <div className="flex h-max w-full items-center justify-between">
        <p className="text-sm text-neutral-500">{title}</p>
        <p className="font-serif font-medium text-indigo-500">{tasks.length}</p>
      </div>
      {tasks.length == 0 ? (
        <></>
      ) : (
        <div className="flex w-full flex-col gap-2 overflow-scroll">
          {tasks.map((task, index) => {
            return <StaticTaskCard task={task} key={index}></StaticTaskCard>;
          })}
        </div>
      )}
    </div>
  );
}

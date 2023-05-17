import { BellIcon } from "@heroicons/react/24/solid";
import { Task } from "../../models/entities/Task";
import avatar from "../../assets/avatar.png";
import { useState, useRef } from "react";
import Draggable from "react-draggable";

interface IProps {
  task: Task;
  onClick: () => void;
}

export default function TaskCard(props: IProps) {
  const { task, onClick } = props;
  // const [taskYPosition, setTaskYPosition] = useState<number | null>(null);
  // const taskLineRef = useRef<any>(null);

  // const handleTaskDrag = (ev: any) => {
  //   console.log(ev.movementY);
  //   setTaskYPosition((prev) => {
  //     if (prev) {
  //       if (ev.movementY > 0) {
  //         return prev - 86;
  //       } else {
  //         return prev + 80;
  //       }
  //     } else {
  //       if (ev.movementY > 0) {
  //         return -86;
  //       } else {
  //         return 80;
  //       }
  //     }
  //   });
  // };

  // const handleTaskStopDrag = (ev: any) => {
  //   if (taskYPosition) {
  //     const newPosition = Math.floor(taskYPosition / 84);
  //   }
  //   //   if (newPosition !== 0 && newPosition !== -1) {
  //   //     const newOrder = newPosition < -1 ? column.order - 1 : column.order + 1;
  //   //     let formData = new FormData();
  //   //     formData.append("columnId", column._id);
  //   //     formData.append("order", newOrder.toString());
  //   //     formData.append("form-id", "updateColumnOrder");
  //   //     submit(formData, {
  //   //       method: "post",
  //   //       action: "/user/projects/" + id,
  //   //     });
  //   //   }
  //   // }

  //   setTaskYPosition(null);
  // };

  return (
    <div className="relative h-max w-full">
      {/* <Draggable
        axis="none"
        nodeRef={taskLineRef}
        defaultPosition={{ x: 0, y: 0 }}
        grid={[86, 86]}
        onDrag={handleTaskDrag}
        onStop={handleTaskStopDrag}
      > */}
      <div
        // ref={taskLineRef}
        className="h-max w-full cursor-grab gap-2 rounded-lg border border-neutral-600 bg-neutral-800/60 p-2 transition hover:border-neutral-400"
      >
        <div></div>
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
                new Date() > new Date(task.endDate) ? "w-4 text-red-700" : "w-4"
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
        <div
          onClick={onClick}
          className="word-break mt-2 flex h-max w-full cursor-pointer flex-col leading-4 hover:underline"
        >
          <p className="break-all font-serif text-base">{task.title}</p>
        </div>
        {task.users && task.users.length > 0 ? (
          <div className="mt-1.5 flex w-full flex-wrap gap-2">
            {task.users.map((user, index) => {
              return (
                <div key={index} className="basis-7 overflow-hidden rounded-lg">
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
      {/* </Draggable> */}
      {/* <div
        style={{
          bottom: taskYPosition !== null ? taskYPosition : -4,
          display: taskYPosition !== null ? "flex" : "none",
        }}
        className="z-80 absolute flex  w-full "
      >
        <div className="w-full border-b-2 border-indigo-500"></div>
      </div> */}
    </div>
  );
}

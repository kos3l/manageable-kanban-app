import { BellIcon } from "@heroicons/react/24/solid";
import { Task } from "../../models/entities/Task";
import avatar from "../../assets/avatar.png";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";
import LabelCard from "./LabelCard";

interface IProps {
  task: Task;
  onClick: () => void;
  index: number;
  id: string;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export default function TaskCard(props: IProps) {
  const { task, id, onClick, index, moveCard } = props;
  const ref = useRef<HTMLDivElement>(null);

  const ItemTypes = {
    CARD: "card",
  };

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      className="relative h-max w-full"
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
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
    </div>
  );
}

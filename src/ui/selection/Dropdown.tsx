import { ReactNode, useState } from "react";
import { colorIndex } from "../../models/util/ColorIndex";

interface IProps<T> {
  icon: ReactNode;
  value: T;
  onChange: (newValue: T) => void;
  color: string;
  dropdownValues: T[];
  displayProperty?: string;
}

type colorVariants = {
  indigo: string;
  white: string;
};

export default function Dropdown<T>(props: IProps<T>) {
  const { icon, color, value, onChange, dropdownValues, displayProperty } =
    props;

  const boxColorVariants: colorIndex & colorVariants = {
    indigo:
      "flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/30",
    white: "flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700",
  };

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div
      className={
        isExpanded ? " relative flex h-max w-full" : " flex h-12 w-full"
      }
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={
          isExpanded
            ? "absolute z-40 flex h-max w-full cursor-pointer flex-wrap items-center rounded-lg border border-neutral-600 bg-neutral-900 px-2"
            : "flex h-full w-full cursor-pointer flex-wrap items-center rounded-lg border border-neutral-600 bg-neutral-900 px-2"
        }
      >
        <div
          onChange={(event) => {}}
          className="text-md flex h-12 flex-auto grow items-center gap-2 bg-transparent px-1 font-sans font-thin tracking-normal text-neutral-400"
        >
          <p className="mt-1 font-medium tracking-wider text-neutral-300">
            {displayProperty
              ? (value as { [key in string]: any })[displayProperty]
              : value}
          </p>
        </div>
        <div className={`${boxColorVariants[color]}`}>{icon}</div>
        <div
          className={
            isExpanded
              ? "relative flex h-max w-full flex-col gap-2 pb-2"
              : "hidden"
          }
        >
          {displayProperty
            ? dropdownValues.map((item, index) => {
                return (
                  <div className="" key={index}>
                    {(item as { [key in string]: any })[displayProperty]}
                  </div>
                );
              })
            : dropdownValues.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex w-full items-center rounded-md bg-neutral-800 py-2 px-3"
                  >
                    <>{item}</>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

import { ReactNode, useState } from "react";
import { colorIndex } from "../../models/util/ColorIndex";

interface IProps<T> {
  icon: ReactNode;
  value: T;
  onSelectValue: (newValue: T) => void;
  color: string;
  dropdownValues: T[];
  displayProperty?: string;
  placeholder: string;
}

type colorVariants = {
  indigo: string;
  white: string;
};

export default function Dropdown<T>(props: IProps<T>) {
  const {
    icon,
    color,
    value,
    onSelectValue,
    placeholder,
    dropdownValues,
    displayProperty,
  } = props;

  const boxColorVariants: colorIndex & colorVariants = {
    indigo:
      "flex h-7 w-7  cursor-pointer items-center justify-center rounded-lg bg-indigo-600/30",
    white:
      "flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-neutral-700",
  };

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div
      className={
        isExpanded ? "relative mb-12 flex h-max w-full" : " flex h-12 w-full"
      }
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        tabIndex={0}
        className={
          isExpanded
            ? "absolute z-40 flex h-max w-full  flex-wrap items-center rounded-lg border border-neutral-600 bg-neutral-900 px-2"
            : "flex h-full w-full  flex-wrap items-center rounded-lg border border-neutral-600 bg-neutral-900 px-2"
        }
      >
        <div className="text-md flex h-12 flex-auto grow cursor-pointer items-center gap-2 bg-transparent px-1 font-sans font-thin tracking-normal text-neutral-400">
          <p className="mt-0.5 tracking-wider text-neutral-400">
            {value ? (
              displayProperty ? (
                (value as { [key in string]: any })[displayProperty]
              ) : (
                value
              )
            ) : (
              <span className="mb-2 font-normal tracking-normal text-neutral-600">
                {placeholder}
              </span>
            )}
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
                  <div
                    className="flex w-full cursor-pointer items-center rounded-md border border-neutral-800 bg-neutral-800 py-2 px-3 transition hover:border-neutral-400"
                    key={index}
                    onClick={() => onSelectValue(item)}
                    tabIndex={0}
                  >
                    <p className="mt-1 tracking-wider opacity-80">
                      {(item as { [key in string]: any })[displayProperty]}
                    </p>
                  </div>
                );
              })
            : dropdownValues.map((item, index) => {
                return (
                  <div
                    key={index}
                    tabIndex={0}
                    onClick={() => onSelectValue(item)}
                    className="flex w-full cursor-pointer items-center rounded-md border border-neutral-800  bg-neutral-800 py-2 px-3 transition hover:border-neutral-400"
                  >
                    <p className="mt-1 tracking-wider opacity-80">
                      <>{item}</>
                    </p>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

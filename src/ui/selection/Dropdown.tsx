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
  name?: string;
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
    name,
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
          <input
            type="text"
            name={name}
            readOnly
            className="text-md h-full grow bg-transparent pl-0.5 pr-2 pt-0.5 font-sans font-thin tracking-normal text-neutral-400 placeholder:font-thin placeholder:tracking-wide placeholder:text-neutral-600 focus:outline-none"
            placeholder={placeholder}
            value={
              value
                ? displayProperty
                  ? (value as { [key in string]: any })[displayProperty]
                  : value
                : ""
            }
          />
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

import { ReactNode } from "react";
import { colorIndex } from "../../models/util/ColorIndex";

interface IProps {
  content: string;
  icon: ReactNode;
  onClick?: () => void;
  color: string;
  isSubmitBtn?: boolean;
  isDisabled?: boolean;
  isSmaller?: boolean;
}

type colorVariants = {
  indigo: string;
  red: string;
};

export default function ActionButton(props: IProps) {
  const { icon, color, content, onClick, isSubmitBtn, isDisabled, isSmaller } =
    props;

  const wrapperColorVariants: colorIndex & colorVariants = {
    indigo:
      "flex w-full disabled:opacity-75 disabled:border-neutral-600 items-center gap-3 rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-3 transition hover:border-indigo-600 hover:drop-shadow-xl hover:transition",
    red: "flex w-full items-center gap-4 disabled:opacity-75 disabled:border-neutral-600 rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-3 transition hover:border-red-700 hover:drop-shadow-4xl hover:transition",
    white:
      "flex w-full items-center gap-4 disabled:opacity-75 disabled:border-neutral-600 rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-3 transition hover:border-neutral-300 hover:drop-shadow-4xl hover:transition",
  };

  const boxColorVariants: colorIndex & colorVariants = {
    indigo:
      "flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/30",
    red: "flex h-9 w-9 items-center justify-center rounded-lg bg-red-800/20",
    white:
      "flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-200/20",
  };

  return (
    <button
      style={isSmaller ? { padding: "7px" } : {}}
      type={isSubmitBtn ? "submit" : "button"}
      onClick={onClick ? () => onClick() : undefined}
      className={`${wrapperColorVariants[color]}`}
      disabled={isDisabled}
    >
      <div
        style={isSmaller ? { width: "2rem", height: "2rem" } : {}}
        className={`${boxColorVariants[color]}`}
      >
        {icon}
      </div>
      <p className="m-0 font-serif text-sm font-semibold tracking-wider ">
        {content}
      </p>
    </button>
  );
}

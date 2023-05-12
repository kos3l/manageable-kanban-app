import { ReactNode } from "react";
import { colorIndex } from "../../models/util/ColorIndex";

interface IProps {
  content: string;
  icon: ReactNode;
  onClick?: () => void;
  color: string;
  isSubmitBtn?: boolean;
}

type colorVariants = {
  indigo: string;
  red: string;
};

export default function ActionButton(props: IProps) {
  const { icon, color, content, onClick, isSubmitBtn } = props;

  const wrapperColorVariants: colorIndex & colorVariants = {
    indigo:
      "flex w-full items-center gap-3 rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-3 transition hover:border-indigo-600 hover:drop-shadow-xl hover:transition",
    red: "flex w-full items-center gap-4 rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-3 transition hover:border-red-700 hover:drop-shadow-4xl hover:transition",
  };

  const boxColorVariants: colorIndex & colorVariants = {
    indigo:
      "flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/30",
    red: "flex h-9 w-9 items-center justify-center rounded-lg bg-red-800/20",
  };

  return (
    <button
      type={isSubmitBtn ? "submit" : "button"}
      onClick={onClick ? () => onClick() : undefined}
      className={`${wrapperColorVariants[color]}`}
    >
      <div className={`${boxColorVariants[color]}`}>{icon}</div>
      <p className="m-0 font-serif text-sm font-semibold tracking-wider">
        {content}
      </p>
    </button>
  );
}

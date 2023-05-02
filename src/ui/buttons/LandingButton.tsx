import { ReactNode } from "react";
import { colorIndex } from "../../models/util/ColorIndex";

interface IProps {
  content: string;
  icon: ReactNode;
  color: string;
}

type colorVariants = {
  indigo: string;
  pink: string;
  white: string;
};

export default function LandingButton(props: IProps) {
  const { icon, content, color } = props;
  const wrapperColorVariants: colorIndex & colorVariants = {
    indigo:
      "flex w-full items-center gap-4 rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-3 transition hover:border-indigo-600 hover:drop-shadow-4xl hover:transition",
    pink: "flex w-full items-center gap-4 rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-3 transition hover:border-pink-600 hover:drop-shadow-4xl hover:transition",
    white:
      "flex w-full items-center gap-4 rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-3 transition hover:border-neutral-300 hover:drop-shadow-4xl hover:transition",
  };
  const boxColorVariants: colorIndex & colorVariants = {
    indigo:
      "flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/30",
    pink: "flex h-10 w-10 items-center justify-center rounded-lg bg-pink-600/30",
    white:
      "flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200/20",
  };

  return (
    <button className={`${wrapperColorVariants[color]}`}>
      <div className={`${boxColorVariants[color]}`}>{icon}</div>
      <p className="m-0 font-serif text-sm font-semibold tracking-wide">
        {content}
      </p>
    </button>
  );
}

import { ReactNode } from "react";

interface IProps {
  content: string;
  icon: ReactNode;
  color: string;
}

type test = {
  indigo: string;
  pink: string;
};
type testIndex = {
  [key: string]: string;
};

export default function LandingButton(props: IProps) {
  const { icon, content, color } = props;
  const wrapperColorVariants: testIndex & test = {
    indigo:
      "flex w-full items-center gap-4 rounded-xl border-2 border-neutral-600 bg-neutral-900 px-3 py-3 transition hover:border-indigo-600 hover:drop-shadow-4xl hover:transition",
    pink: "flex w-full items-center gap-4 rounded-xl border-2 border-neutral-600 bg-neutral-900 px-3 py-3 transition hover:border-pink-600 hover:drop-shadow-4xl hover:transition",
    white:
      "flex w-full items-center gap-4 rounded-xl border-2 border-neutral-600 bg-neutral-900 px-3 py-3 transition hover:border-neutral-300 hover:drop-shadow-4xl hover:transition",
  };
  const boxColorVariants: testIndex & test = {
    indigo:
      "flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/40",
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

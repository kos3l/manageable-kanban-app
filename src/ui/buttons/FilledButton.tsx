import { ReactNode } from "react";

interface IProps {
  content: string;
  icon: ReactNode;
  onClick?: () => void;
  removeBackground: boolean;
}

export default function FilledButton(props: IProps) {
  const { icon, content, onClick, removeBackground } = props;

  return (
    <button
      onClick={onClick}
      className={
        removeBackground
          ? "flex h-12 w-full items-center gap-2 rounded-lg border border-neutral-600 px-2 py-3 transition hover:border-neutral-400 hover:drop-shadow-4xl hover:transition"
          : "flex h-12 w-full items-center gap-2 rounded-lg border border-neutral-600 bg-neutral-700/50 px-2 py-3 transition hover:border-neutral-400 hover:drop-shadow-4xl hover:transition"
      }
    >
      <div
        className={
          "flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-200/30"
        }
      >
        {icon}
      </div>
      <p className="m-0 font-serif text-xs font-medium tracking-wider">
        {content}
      </p>
    </button>
  );
}

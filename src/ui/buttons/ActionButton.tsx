import { ReactNode } from "react";

interface IProps {
  content: string;
  icon: ReactNode;
}

export default function ActionButton(props: IProps) {
  const { icon, content } = props;
  return (
    <button className="flex w-full items-center gap-3 rounded-xl border-2 border-neutral-600 bg-neutral-900 px-3 py-3 transition hover:border-indigo-600 hover:drop-shadow-xl hover:transition">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/30">
        {icon}
      </div>
      <p className="m-0 font-serif text-sm font-semibold tracking-wider">
        {content}
      </p>
    </button>
  );
}
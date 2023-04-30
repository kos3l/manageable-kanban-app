import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface IProps {
  content: string;
  icon: ReactNode;
  toPath: string;
}

export default function NavigationButton(props: IProps) {
  const { icon, content, toPath } = props;
  return (
    <Link to={toPath}>
      <button className="flex h-14 w-full items-center gap-3 px-4 hover:border-r hover:border-indigo-500 hover:bg-neutral-800/50">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/30">
          {icon}
        </div>
        <p className="text-sm tracking-wide">{content}</p>
      </button>
    </Link>
  );
}

import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useMatch } from "react-router-dom";
interface IProps {
  content: string;
  icon: ReactNode;
  toPath: string;
}

export default function NavigationButton(props: IProps) {
  const { icon, content, toPath } = props;
  const isCurrentPath = useMatch(toPath);

  return (
    <Link to={toPath}>
      <button
        className={
          isCurrentPath
            ? "flex h-14 w-full items-center gap-3 border-r border-indigo-500 bg-neutral-800/50 px-4"
            : "flex h-14 w-full items-center gap-3 px-4 hover:border-r hover:border-indigo-500 hover:bg-neutral-800/50"
        }
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/30">
          {icon}
        </div>
        <p className="text-left text-xs tracking-wide lg:text-sm">{content}</p>
      </button>
    </Link>
  );
}

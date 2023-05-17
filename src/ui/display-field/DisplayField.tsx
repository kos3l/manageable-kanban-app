import { ReactNode } from "react";
import { colorIndex } from "../../models/util/ColorIndex";

interface IProps {
  icon?: ReactNode;
  value?: string;
  label: string;
  placeholder: string;
  color: string;
}

type colorVariants = {
  red: string;
  white: string;
};

export default function DisplayField(props: IProps) {
  const { icon, value, label, placeholder, color } = props;

  const boxColorVariants: colorIndex & colorVariants = {
    red: "flex h-9 w-9 items-center justify-center rounded-md bg-red-900/20",
    white:
      "flex h-9 w-9 items-center justify-center rounded-md bg-neutral-600/70",
  };

  return (
    <div className="flex h-max w-full items-center gap-2">
      {icon && <div className={`${boxColorVariants[color]}`}>{icon}</div>}
      <div className="break-word flex h-max flex-col">
        <p className="text-xs leading-4 text-neutral-500/90">{label}</p>
        <p className="text-sm leading-4 tracking-wider ">
          {value ? value : <span className=" opacity-20">{placeholder}</span>}
        </p>
      </div>
    </div>
  );
}

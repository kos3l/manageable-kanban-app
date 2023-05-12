import { ReactNode } from "react";

interface IProps {
  icon?: ReactNode;
  value?: string;
  label: string;
  placeholder: string;
}

export default function DisplayField(props: IProps) {
  const { icon, value, label, placeholder } = props;

  return (
    <div className="flex w-full items-center gap-2 overflow-scroll">
      {icon && (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-600/70">
          {icon}
        </div>
      )}
      <div className="flex h-max flex-col">
        <p className="truncate text-xs leading-4 text-neutral-500/90">
          {label}
        </p>
        <p className="truncate text-sm leading-4 tracking-wider">
          {value ? (
            value
          ) : (
            <span className="truncate opacity-20">{placeholder}</span>
          )}
        </p>
      </div>
    </div>
  );
}

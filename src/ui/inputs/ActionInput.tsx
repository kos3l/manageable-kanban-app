import { ReactNode } from "react";

interface IProps {
  placeholder: string;
  icon: ReactNode;
  value?: string;
  onChange: (newValue: string) => void;
  onClick: (newValue: string) => void;
  name?: string;
}

export default function ActionInput(props: IProps) {
  const { icon, placeholder, value, onChange, name } = props;

  return (
    <div className="flex h-12 w-full items-center rounded-lg border border-neutral-600 bg-neutral-900 px-2">
      <input
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={"text"}
        placeholder={placeholder}
        className="text-md h-full grow bg-transparent px-1 pt-0.5 font-sans font-thin tracking-normal text-neutral-400 placeholder:font-thin placeholder:tracking-wide placeholder:text-neutral-600 focus:outline-none"
      />
      <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-indigo-600/30">
        {icon}
      </div>
    </div>
  );
}

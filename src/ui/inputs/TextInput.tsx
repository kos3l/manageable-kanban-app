import { ReactNode } from "react";

interface IProps {
  placeholder: string;
  icon: ReactNode;
  value?: string;
  onChange: (newValue: string) => void;
}

export default function TextInput(props: IProps) {
  const { icon, placeholder, value, onChange } = props;

  return (
    <div className="flex h-12 w-full items-center rounded-xl border-2 border-neutral-600 bg-neutral-900 px-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700">
        {icon}
      </div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={"text"}
        placeholder={placeholder}
        className="text-md h-full grow bg-transparent px-3 pt-0.5 font-sans font-thin tracking-normal text-neutral-400 placeholder:font-thin placeholder:tracking-wide placeholder:text-neutral-600 focus:outline-none"
      />
    </div>
  );
}

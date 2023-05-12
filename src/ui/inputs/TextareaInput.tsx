import { ReactNode } from "react";

interface IProps {
  placeholder: string;
  icon: ReactNode;
  value?: string;
  onChange: (newValue: string) => void;
  name: string;
}

export default function TextareaInput(props: IProps) {
  const { icon, placeholder, value, onChange, name } = props;

  return (
    <div className="min-h-16 flex h-max w-full items-start rounded-lg border border-neutral-600 bg-neutral-900 px-2">
      <div className="mt-2 flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700">
        {icon}
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        name={name}
        placeholder={placeholder}
        spellCheck={false}
        className="text-md h-full grow bg-transparent px-3 pt-2 font-sans font-thin tracking-normal text-neutral-400 placeholder:font-thin placeholder:tracking-wide placeholder:text-neutral-600 focus:outline-none"
      ></textarea>
    </div>
  );
}

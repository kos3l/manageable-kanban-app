import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { ReactNode, useState } from "react";

interface IProps {
  placeholder: string;
  icon?: ReactNode;
  value?: string;
  onChange: (newValue: string) => void;
  name?: string;
  isRequred?: boolean;
  minLenght?: number;
}

export default function TextInput(props: IProps) {
  const { icon, placeholder, value, onChange, name, isRequred, minLenght } =
    props;
  const [showError, setShowError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  function handleOnBlur(val: string) {
    if (isRequred && val == "") {
      setError("Field is required!");
      setShowError(true);
    } else if (minLenght && minLenght > val.length) {
      setError(`Filed must be atleast ${minLenght} characters.`);
      setShowError(true);
    } else {
      setError("");
      setShowError(false);
    }
  }
  return (
    <div
      style={showError ? { borderColor: "#7f1d1d" } : {}}
      className="relative flex h-12 w-full items-center rounded-lg border border-neutral-600 bg-neutral-900 px-2"
    >
      {icon && (
        <div className="flex h-7 w-7 min-w-[1.8rem] items-center justify-center rounded-lg bg-neutral-700">
          {icon}
        </div>
      )}
      <input
        minLength={minLenght}
        required={isRequred}
        onBlur={(event) => handleOnBlur(event.target.value)}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={"text"}
        placeholder={placeholder}
        className="text-md h-full grow bg-transparent px-3 pt-0.5 font-sans font-thin tracking-normal text-neutral-400 placeholder:font-thin placeholder:tracking-wide placeholder:text-neutral-600 focus:outline-none"
      />
      {showError && error !== "" ? (
        <div className="absolute right-3 top-[14px]">
          <p className="text-sm text-red-900">{error}</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

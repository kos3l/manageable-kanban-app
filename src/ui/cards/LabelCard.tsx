import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Label } from "../../models/entities/Label";
import { colorIndex } from "../../models/util/ColorIndex";

interface IProps {
  label: Label;
  onClick?: () => void;
}

export default function LabelCard(props: IProps) {
  const { label, onClick } = props;

  type tailwindColor = { name: string; hex: string };
  type colorVariants = {
    pink: string;
    violet: string;
    indigo: string;
    green: string;
    amber: string;
    red: string;
    cyan: string;
    white: string;
  };

  const colors: tailwindColor[] = [
    { name: "pink", hex: "#db2777" },
    { name: "violet", hex: "#7c3aed" },
    { name: "indigo", hex: "#4338ca" },
    { name: "green", hex: "#16a34a" },
    { name: "amber", hex: "#f59e0b" },
    { name: "red", hex: "#b91c1c" },
    { name: "cyan", hex: "#06b6d4" },
    { name: "white", hex: "#d4d4d4" },
  ];

  const boxColorVariants: colorIndex & colorVariants = {
    pink: "w-max h-max rounded border border-pink-600 text-pink-600 px-2 flex items-center bg-pink-600/20 ",
    violet:
      "w-max h-max rounded border border-violet-600 text-violet-600 px-2 flex items-center  bg-violet-600/20",
    indigo:
      "w-max h-max rounded border border-indigo-700 text-indigo-700 px-2 flex items-center  bg-indigo-700/10",
    green:
      "w-max h-max rounded border border-green-600 text-green-600 px-2 flex items-center  bg-green-600/20",
    amber:
      "w-max h-max rounded border border-amber-500 text-amber-500 px-2 flex items-center  bg-amber-500/20",
    red: "w-max h-max rounded border border-red-700 text-red-700 px-2 flex items-center bg-red-700/20",
    cyan: "w-max h-max rounded border border-cyan-500 text-cyan-500 px-2 flex items-center  bg-cyan-500/20",
    white:
      "w-max h-max rounded border border-neutral-300 text-neutral-300 px-2 flex items-center d bg-neutral-300/20",
  };

  const coloName = colors.find((col) => col.hex == label.color)!.name;

  return (
    <div key={label._id} className={`${boxColorVariants[coloName]}`}>
      <p className="mt-0.5 tracking-wider">{label.name}</p>
      {onClick ? (
        <XMarkIcon
          onClick={() => onClick()}
          className="ml-2 w-4 cursor-pointer"
          style={{ color: label.color }}
        ></XMarkIcon>
      ) : (
        <></>
      )}
    </div>
  );
}

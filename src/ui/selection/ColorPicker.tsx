import { ReactNode, useEffect, useRef, useState } from "react";
import { colorIndex } from "../../models/util/ColorIndex";

interface IProps {
  value: string;
  onSelectValue: (newValue: string) => void;
}

export default function ColorPicker(props: IProps) {
  const { value, onSelectValue } = props;
  const mainRef = useRef<any>(null);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    pink: "h-5 w-5 rounded bg-pink-600 ",
    violet: "h-5 w-5 rounded bg-violet-600",
    indigo: "h-5 w-5 rounded bg-indigo-700",
    green: "h-5 w-5 rounded bg-green-600",
    amber: "h-5 w-5 rounded bg-amber-500",
    red: "h-5 w-5 rounded bg-red-700",
    cyan: "h-5 w-5 rounded bg-cyan-500",
    white: "h-5 w-5 rounded bg-neutral-300",
  };

  const defaultColor =
    value !== "" ? colors.find((col) => col.hex == value)!.name : "pink";

  const handleClickOutside = (event: MouseEvent) => {
    if (mainRef.current && !mainRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  return (
    <div
      ref={mainRef}
      onClick={() => {
        if (!isExpanded) {
          setIsExpanded(true);
        }
      }}
      className={
        isExpanded
          ? "relative flex h-12 min-w-[3rem] basis-12 flex-col items-center justify-center rounded-lg  border border-b-0 border-neutral-600"
          : "relative flex h-12 min-w-[3rem] basis-12 cursor-pointer flex-col items-center justify-center rounded-lg  border border-neutral-600"
      }
    >
      <button className={`${boxColorVariants[defaultColor]}`}></button>
      {isExpanded ? (
        <div className="absolute top-10 z-40 mb-4 flex h-max w-[3rem] flex-col items-center gap-3 rounded-lg rounded-t-none border border-t-0 border-neutral-600 bg-neutral-900 pt-2 pb-4">
          {colors.map((col, index) => {
            return (
              <div
                onClick={() => {
                  setIsExpanded(false);
                  onSelectValue(col.hex);
                }}
                key={index}
                className="h-4 w-4 cursor-pointer rounded transition hover:opacity-50"
                style={{ backgroundColor: col.hex }}
              ></div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

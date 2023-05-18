import { Doughnut } from "react-chartjs-2";
import { Column } from "../../models/entities/Column";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

interface IProps {
  columns: Column[];
}

export default function TasksPerColumnChart(props: IProps) {
  const { columns } = props;

  if (!columns) {
    return <>Loading</>;
  }

  type tailwindColor = { name: string; hex: string };
  const colors: tailwindColor[] = [
    { name: "pink", hex: "#db2777" },
    { name: "violet", hex: "#7c3aed" },
    { name: "indigo", hex: "#4338ca" },
    { name: "green", hex: "#16a34a" },
    { name: "amber", hex: "#f59e0b" },
    { name: "red", hex: "#b91c1c" },
    { name: "cyan", hex: "#06b6d4" },
    { name: "white", hex: "#d4d4d4" },
    { name: "red-l", hex: "#fca5a5" },
    { name: "red-d", hex: "#7f1d1d" },
    { name: "yellow-l", hex: "#fef3c7" },
    { name: "green-l", hex: "#d9f99d" },
    { name: "green-d", hex: "#365314" },
    { name: "emerald-d", hex: "#34d399" },
    { name: "blue-d", hex: "#1e3a8a" },
    { name: "rose", hex: "#fda4af" },
    { name: "rose-d", hex: "#881337" },
    { name: "fuchsia", hex: "#d946ef" },
    { name: "purple", hex: "#c084fc" },
    { name: "purple-d", hex: "#4c1d95" },
    { name: "lime", hex: "#ecfccb" },
  ];

  type columnsChartData = {
    id: number;
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  };

  const toRGBA = (color: string) => {
    const { style } = new Option();
    style.color = color;
    return style.color.replace(")", ", 0.2)").replace("rgb", "rgba");
  };

  const chartColumns: columnsChartData = {
    id: 1,
    label: "Tasks",
    data: columns.map((col) => col.tasks.length),
    backgroundColor: colors.map((col) => toRGBA(col.hex)),
    borderColor: colors.map((col) => col.hex),
    borderWidth: 1,
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-between gap-3 p-3">
      <div className="flex w-full text-neutral-600">
        <p>Tasks per column</p>
      </div>
      <div className="flex h-max w-1/2 2xl:w-[280px]">
        <Doughnut
          data={{
            labels: columns.map((col) => col.name),
            datasets: [chartColumns],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        ></Doughnut>
      </div>
      <div className="mt-4 flex h-max w-full flex-wrap gap-3">
        {columns
          .sort((a, b) => b.tasks.length - a.tasks.length)
          .map((col, index) => {
            return (
              <div
                key={index}
                className="basis-max flex grow items-center gap-2 rounded-lg px-3 py-2 leading-4"
                style={{
                  backgroundColor: toRGBA(colors[index].hex),
                  border: "1px solid" + colors[index].hex,
                }}
              >
                <p className="traking-wider font-serif text-sm">{col.name}</p>
                <p className="mt-0.5 text-lg font-medium">
                  {col.tasks.length}
                </p>{" "}
              </div>
            );
          })}
      </div>
    </div>
  );
}

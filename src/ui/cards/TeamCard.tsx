import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Team } from "../../models/entities/Team";

interface IProps {
  team: Team;
  icon: ReactNode;
}

export default function TeamCard(props: IProps) {
  const { icon, team } = props;

  return (
    <Link to={"../teams/" + team._id}>
      <div
        key={team._id}
        className="col-span-1 flex h-20 flex-col justify-between rounded-lg border border-neutral-600 bg-neutral-800/50 p-2"
      >
        <div className={"flex h-6 w-6 items-center justify-center"}>{icon}</div>
        <p className="font-serif text-base tracking-widest">{team.name}</p>
      </div>
    </Link>
  );
}

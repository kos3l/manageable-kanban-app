import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
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
        className="flex h-20 w-full flex-col justify-between rounded-lg border border-neutral-600 bg-neutral-800/50 px-2 pt-2 pb-1 transition hover:border-neutral-400"
      >
        <div className={"flex h-6 w-6 items-center justify-center"}>{icon}</div>
        <div className="flex w-full items-end justify-between">
          <p className="truncate font-serif text-base tracking-widest">
            {team.name}
          </p>
          {team.projects && (
            <div className="flex items-center gap-1">
              <ClipboardDocumentListIcon className="w-4 text-neutral-500"></ClipboardDocumentListIcon>
              <p className="mt-0.5 text-base text-neutral-500">
                {team.projects?.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

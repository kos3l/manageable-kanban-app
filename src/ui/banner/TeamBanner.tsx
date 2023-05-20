import { UsersIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { Team } from "../../models/entities/Team";

interface IProps {
  team: Team;
}

export default function TeamBanner(props: IProps) {
  const { team } = props;

  if (!team) {
    return <>Loading</>;
  }

  return (
    <Link to={"/user/teams/" + team._id}>
      <div className="flex h-max w-full justify-between rounded-lg border border-neutral-600 bg-neutral-800/50 p-3 transition hover:bg-neutral-800/70">
        <div className="flex w-max items-center gap-3">
          <div className="flex h-20 w-20 min-w-[5rem] items-center justify-center  rounded-lg border border-neutral-600 bg-gradient-to-r from-violet-600 to-indigo-500  sm:border-0 ">
            <UsersIcon className="w-12"></UsersIcon>
          </div>
          <div className="flex flex-col items-start leading-4">
            <p className="tracking-wider text-neutral-600">Team</p>
            <h1 className="font-serif text-lg sm:text-2xl">{team.name}</h1>{" "}
          </div>
        </div>
      </div>
    </Link>
  );
}

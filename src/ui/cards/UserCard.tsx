import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Team } from "../../models/entities/Team";
import { User } from "../../models/entities/User";
import avatar from "../../assets/avatar.png";

interface IProps {
  user: User;
  icon: ReactNode;
}

export default function UserCard(props: IProps) {
  const { icon, user } = props;

  return (
    <Link to={"../profile/" + user._id}>
      <div
        key={user._id}
        className="flex h-12 w-full items-center gap-2 overflow-scroll rounded-lg border border-neutral-600 bg-neutral-800/50 px-2 transition hover:border-neutral-400"
      >
        <div className="basis-7 overflow-hidden rounded-lg">
          <img src={avatar} alt="" className="h-full w-full object-contain" />
        </div>
        <p className="mt-1 grow truncate">
          <span className="opacity-70">
            {user.firstName + " " + user.lastName}
          </span>{" "}
          - {user.email}
        </p>
      </div>
    </Link>
  );
}

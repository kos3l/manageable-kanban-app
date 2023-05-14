import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Team } from "../../models/entities/Team";
import { User } from "../../models/entities/User";
import avatar from "../../assets/avatar.png";
import { colorIndex } from "../../models/util/ColorIndex";

interface IProps {
  user: User;
  icon?: ReactNode;
  onClick?: () => void;
  isActionCard: boolean;
  color: string;
}

type colorVariants = {
  indigo: string;
  red: string;
};

export default function UserCard(props: IProps) {
  const { icon, user, onClick, isActionCard, color } = props;

  const boxColorVariants: colorIndex & colorVariants = {
    indigo:
      "flex h-8 w-8 min-w-[2rem] items-center cursor-pointer hover:bg-indigo-600/50 transition justify-center rounded-lg bg-indigo-600/30",
    red: "flex h-8 w-8 min-w-[2rem] cursor-pointer items-center hover:bg-red-800/40 transition justify-center rounded-lg bg-red-800/20",
  };

  return (
    <>
      {isActionCard ? (
        <div
          key={user._id}
          className={
            "flex h-12 w-full items-center justify-between gap-2 overflow-scroll rounded-lg border border-neutral-600 bg-neutral-800/50 px-2"
          }
        >
          <div className="flex grow gap-2">
            <div className="basis-7 overflow-hidden rounded-lg">
              <img
                src={avatar}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
            <p className="mt-1 grow truncate">
              <span className="opacity-70">
                {user.firstName + " " + user.lastName}
              </span>{" "}
              - {user.email}
            </p>
          </div>

          <div onClick={onClick} className={`${boxColorVariants[color]}`}>
            {icon}
          </div>
        </div>
      ) : (
        <Link to={"../profile/" + user._id}>
          <div
            key={user._id}
            className={
              "flex h-12 w-full items-center justify-between gap-2 overflow-scroll rounded-lg border border-neutral-600 bg-neutral-800/50 px-2 transition hover:border-neutral-400"
            }
          >
            <div className="flex grow gap-2">
              <div className="basis-7 overflow-hidden rounded-lg">
                <img
                  src={avatar}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-1 grow truncate">
                <span className="opacity-70">
                  {user.firstName + " " + user.lastName}
                </span>{" "}
                - {user.email}
              </p>
            </div>
          </div>
        </Link>
      )}{" "}
    </>
  );
}

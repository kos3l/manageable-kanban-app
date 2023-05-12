import { useLoaderData, useRouteLoaderData } from "react-router-dom";
import { User } from "../../models/entities/User";
import avatar from "../../assets/avatar.png";
import ActionButton from "../../ui/buttons/ActionButton";
import { CakeIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import DisplayField from "../../ui/display-field/DisplayField";

export default function Profile() {
  const user = useRouteLoaderData("userRoot") as User;
  return (
    <div className="flex w-full gap-4">
      <div className="flex basis-72 flex-col gap-3">
        <div className="w-full overflow-hidden rounded-lg">
          <img src={avatar} alt="" className="h-full w-full object-contain" />
        </div>
        <ActionButton
          content={"Edit Profile"}
          icon={
            <PencilSquareIcon className="w-5 text-indigo-500"></PencilSquareIcon>
          }
        ></ActionButton>
      </div>
      <div className="flex grid h-max grow grid-cols-4 gap-3">
        <div className="col-span-4 flex h-max flex-col gap-2 rounded-lg border border-neutral-600 bg-neutral-800/50 p-3">
          <h1 className="text-xl">{user.firstName + " " + user.lastName}</h1>
          <div className="flex w-full items-center gap-2">
            <div className="flex basis-24">
              <DisplayField
                label={"Birthday"}
                icon={<CakeIcon className="w-5 text-neutral-300"></CakeIcon>}
                placeholder="Missing data"
                value={new Date(user.birthdate).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                })}
              ></DisplayField>
            </div>
            <div className="flex grow truncate">
              <DisplayField
                label={"Bio"}
                placeholder="No description yet"
                value={user.bio}
              ></DisplayField>
            </div>
          </div>
        </div>
        <div className="col-span-2 flex h-max rounded-lg border border-neutral-600 p-3">
          <p>Teams</p>
        </div>
        <div className="col-span-2 flex h-max rounded-lg border border-neutral-600 p-3">
          <p>Projects</p>
        </div>
      </div>
    </div>
  );
}

import {
  HomeIcon,
  ListBulletIcon,
  PlusIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { NavListItem } from "../models/util/NavListItem";

export default class NavigationItems {
  static navItemsList: NavListItem[] = [
    {
      name: "Dashboard",
      path: "/user/user-dashboard",
      icon: <HomeIcon className="w-4 text-indigo-500"></HomeIcon>,
    },
    {
      name: "My Profile",
      path: "/user/profile/",
      icon: <UserIcon className="w-4 text-indigo-500"></UserIcon>,
      param: ":id",
    },
    {
      name: "Overview",
      path: "/user/teams-overview",
      icon: <UserGroupIcon className="w-4 text-indigo-500"></UserGroupIcon>,
      sectionTitle: "TEAM",
    },
    {
      name: "Create A Team",
      path: "/user/teams/create",
      icon: <PlusIcon className="w-4 text-indigo-500"></PlusIcon>,
    },
    {
      name: "Overview",
      path: "/user/projects-overview",
      icon: <Squares2X2Icon className="w-4 text-indigo-500"></Squares2X2Icon>,
      sectionTitle: "PROJECT",
    },
    {
      name: "Kanban Boards",
      path: "/user/kanban-boards",
      icon: <ListBulletIcon className="w-4 text-indigo-500"></ListBulletIcon>,
    },
    {
      name: "Create A Project",
      path: "/user/project-create",
      icon: <PlusIcon className="w-4 text-indigo-500"></PlusIcon>,
    },
  ];
}

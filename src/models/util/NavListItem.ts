import { ReactNode } from "react";

type NavListItem = {
  name: string;
  path: string;
  icon: ReactNode;
  sectionTitle?: string;
  param?: string;
};

export { type NavListItem };

import { ReactNode } from "react";

type NavListItem = {
  name: string;
  path: string;
  icon: ReactNode;
  sectionTitle?: string;
};

export { type NavListItem };

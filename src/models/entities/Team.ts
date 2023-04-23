type Team = {
  id: string;
  name: string;
  createdBy: string;
  picture?: string;
  users: string[];
  projects?: string[];
  isDeleted: boolean;
  deletedAt?: Date;
};

export { type Team };

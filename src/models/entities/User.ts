type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthdate: Date;
  profilePicture?: string;
  bio?: string;
  teams: string[];
  tasks: string[];
};

export { type User };

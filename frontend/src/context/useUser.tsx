import { createContext, useContext } from "react";

export type User = {
  username: string;
  password: string;
  email: string;
  profilePic: string;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context)
    throw new Error('"useUserContext must be used within UserProvider ');
  return context;
};

export default useUserContext;

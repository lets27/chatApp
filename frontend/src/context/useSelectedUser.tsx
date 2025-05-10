import { createContext, useContext } from "react";

export type SelectedUserContextType = {
  selectedUser: string;
  setSelectedUser: React.Dispatch<React.SetStateAction<string>>;
};

export const selectedUserContext = createContext<
  SelectedUserContextType | undefined
>(undefined);

// Custom hook
export const useSelectedUser = () => {
  const context = useContext(selectedUserContext);
  if (!context) {
    throw new Error(
      "useSelectedUser must be used within a SelectedUserContextProvider"
    );
  }
  return context;
};

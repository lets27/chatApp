import { createContext, useContext } from "react";

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme?: () => void; // Make optional if not all components need it
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default useTheme;

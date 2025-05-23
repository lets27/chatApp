import { JSX, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./Pages/authentication/Signup";
import Login from "./Pages/authentication/login";
import HomePage from "./Pages/Home/HomePage";
import Profile from "./Pages/Profile/profiles";
import useUserContext from "./context/useUser";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import SelectedUserContextProvider from "./context/selectedUserContext";

import SettingsPage from "./Pages/settings/settingsPage";
import useTheme from "./context/useTheme";

function App() {
  const { user, loading } = useUserContext();
  // const { connectSocket } = useSocket();
  const { theme } = useTheme();

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []); // Empty dependency array to run only once on mount

  const routes = [
    {
      path: "/signup",
      element: user ? <Navigate to="/" replace /> : <Signup />,
    },
    {
      path: "/login",
      element: user ? <Navigate to="/" replace /> : <Login />,
    },
    {
      path: "/",
      element: user ? (
        <SelectedUserContextProvider>
          <HomePage />
        </SelectedUserContextProvider>
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: "/profile",
      element: user ? <Profile /> : <Navigate to="/login" replace />,
    },
    {
      path: "/settings",
      element: user ? <SettingsPage /> : <Navigate to="/login" replace />,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme} className="min-h-screen">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />

      <main className="container mx-auto px-4 py-20">
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>
    </div>
  );
}

export default App;

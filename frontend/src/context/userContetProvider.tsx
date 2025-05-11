import { ReactNode, useEffect, useMemo, useState } from "react";
import { User, UserContext } from "./useUser";

type Children = {
  children: ReactNode;
};

const UserContextProvider = ({ children }: Children) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl =
    import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

  useEffect(() => {
    const token = localStorage.getItem("chatToke");
    if (!token) {
      setUser(null);
      setLoading(false);
    } else {
      const fetchUser = async () => {
        try {
          const fetchUser = await fetch(`${baseUrl}/api/official/use`, {
            mode: "cors",
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
          });

          if (!fetchUser.ok) {
            throw new Error("something went wrong try again");
          }

          const user = await fetchUser.json();
          console.log("user returned:", user);
          setUser(user);
          return user;
        } catch (error: unknown) {
          //type guard to check if error is an object
          if (error instanceof Error) {
            console.log(error.message);
            setError(error.message);
          } else {
            console.log("Unexpected error", error);
            setError("An unknown error occurred");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, []);

  const value = useMemo(() => {
    return { loading, error, user, setUser };
  }, [loading, error, user, setUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;

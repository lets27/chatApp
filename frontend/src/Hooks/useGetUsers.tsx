import { useEffect, useState } from "react";

import useUserContext from "../context/useUser";
import toast from "react-hot-toast";

const useGetUsers = () => {
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const { setUser } = useUserContext();
  const baseUrl =
    import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

  useEffect(() => {
    setLoadingUsers(true);
    setError("");

    const token = localStorage.getItem("chatToke");

    if (!token) {
      setUser(null);
      setLoadingUsers(false);
      return;
    }

    const getUsers = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/official`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const users = await res.json();

        if (!res.ok) {
          throw new Error(users.error || "Failed to get users");
        }

        setUsers(users);
      } catch (err: any) {
        toast.error(err.message || "An error occurred");
        setError(err.message);
      } finally {
        setLoadingUsers(false);
      }
    };
    getUsers();
  }, []);

  return { loadingUsers, error, users };
};

export default useGetUsers;

import { useState } from "react";
import { toast } from "react-hot-toast";
import useUserContext from "../context/useUser";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/useSocket";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useUserContext();
  const { connectSocket, disconnectSocket, socket } = useSocket();

  const navigate = useNavigate();

  const login = async (credentials) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      localStorage.setItem("chatToke", data.token);

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      toast.success("Login successful!");
      setUser(data.user);
      connectSocket();
      navigate("/");
      // You can redirect or set auth context here
    } catch (err) {
      disconnectSocket();
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, login };
};

export default useLogin;

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import useUserContext from "../context/useUser";

const useUpdateProfile = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const baseUrl =
    import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

  const updateProfile = async (formData: FormData) => {
    setUpdating(true);
    setError("");

    try {
      const token = localStorage.getItem("chatToke");
      if (!token) throw new Error("Authentication required");

      const res = await fetch(`${baseUrl}/api/official`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const updatedUser = await res.json();

      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success("Profile updated");
      // setUser(updatedUser); // Update context with new user data

      return updatedUser; // Return the updated user data
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      throw err; // Re-throw for component handling
    } finally {
      setUpdating(false);
    }
  };

  return { updateProfile, updating, error };
};

export default useUpdateProfile;

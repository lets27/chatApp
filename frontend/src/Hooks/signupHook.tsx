import { useState } from "react";
import toast from "react-hot-toast";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const baseUrl =
    import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

  const signup = async (formData: FormData) => {
    //come back to this when data is back/// we changed to set the incoming
    //type as  FormData object from the submit handler
    setLoading(true);
    setError("");

    if (!formData) {
      throw new Error("no data passed from the handle submit");
    }

    try {
      const res = await fetch(`${baseUrl}/api/auth/signup`, {
        method: "POST",
        body: formData, // do NOT stringify!
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      toast.success("Signup successful!");
      // Maybe redirect or update state
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, signup };
};

export default useSignup;

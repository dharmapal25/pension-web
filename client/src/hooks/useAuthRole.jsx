import { useState } from "react";
import API from "../services/api";

const useAuthUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/auth/me", {
        withCredentials: true,
      });

      console.log("user : ", data)

      setUser(data);
      return data;
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  console.log(user)
  return {
    user,
    loading,
    fetchUser,
  };
};

export default useAuthUser;
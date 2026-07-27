import { useState, useEffect } from "react";
import axios from "axios";
import API from "../services/api";

const useAuthUser = () => {
  const [user, setUser] = useState({
    _id: null,
    email: null,
    role: null,
  });

  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/auth/me`, {
        withCredentials: true,
      });

      setUser(res.data);
    } catch {
      setUser({
        _id: null,
        email: null,
        role: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    ...user,
    loading,
    refetch: fetchUser,
  };
};

export default useAuthUser;
import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/store/useUserStore";

export const useAuth = () => {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .post(`/api/handleTokenVerification`, {}, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setUser]);

  const handleLogout = async () => {
    try {
      await axios.get(`/api/handleLogout`);
      setUser(null);
    } catch (error) {
      console.log("Something went wrong while logout");
    }
  };

  return { user, loading, handleLogout };
};

import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/store/useUserStore";

let authPromise: Promise<any> | null = null;
let hasAttemptedVerification = false;

export const useAuth = () => {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(!hasAttemptedVerification);

  useEffect(() => {
    if (hasAttemptedVerification) {
      setLoading(false);
      return;
    }

    if (!authPromise) {
      authPromise = axios
        .post(`/api/handleTokenVerification`, {}, { withCredentials: true })
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          setUser(null);
        })
        .finally(() => {
          hasAttemptedVerification = true;
          authPromise = null;
        });
    }

    authPromise.finally(() => {
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

import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/store/useUserStore";
import { fetchAndSyncUserCart, mergeGuestCartOnLogin } from "@/store/useCartStore";

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
        .then(async (res) => {
          const verifiedUser = res.data.user;
          setUser(verifiedUser);
          if (verifiedUser?.id) {
            await mergeGuestCartOnLogin(verifiedUser.id);
            await fetchAndSyncUserCart(verifiedUser.id);
          }
        })
        .catch(() => {
          setUser(null);
      window.location.reload();
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
      window.location.reload();
    } catch (error) {
      console.log("Something went wrong while logout");
    }
  };

  return { user, loading, handleLogout };
};

import { useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";
import { authService } from "../services/auth.service";

export function useInitAuth() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setIsLoading = useAuthStore((s) => s.setIsLoading);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await authService.getMe();
        const token = useAuthStore.getState().accessToken ?? "";
        setAuth(user, token);
      } catch {
        setIsLoading(false);
      }
    };
    void init();
  }, [setAuth, setIsLoading]);
}

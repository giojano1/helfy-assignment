import { useEffect } from "react";
import { useAuthStore, hasSessionHint } from "../../../store/authStore";
import { authService } from "../services/auth.service";

export function useInitAuth() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setIsLoading = useAuthStore((s) => s.setIsLoading);

  useEffect(() => {
    // No session hint means the user has never logged in or explicitly logged out.
    // Skip the network round-trip entirely.
    if (!hasSessionHint()) {
      setIsLoading(false);
      return;
    }

    const init = async () => {
      try {
        const token = await authService.refresh();
        setAccessToken(token);
        const user = await authService.getMe();
        setAuth(user, token);
      } catch {
        // Refresh cookie expired or invalid — treat as logged out.
        setIsLoading(false);
      }
    };
    void init();
  }, [setAuth, setAccessToken, setIsLoading]);
}

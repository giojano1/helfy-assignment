import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/authStore";
import { authService } from "../services/auth.service";
import type { LoginFormData } from "../types";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (res) => {
      setAuth(res.user, res.accessToken);
      navigate("/");
      toast.success(`Welcome back, ${res.user.firstName}!`);
    },
    onError: () => {
      toast.error("Invalid email or password.");
    },
  });
}

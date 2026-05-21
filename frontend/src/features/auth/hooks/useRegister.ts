import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/authStore";
import { authService } from "../services/auth.service";
import type { RegisterFormData } from "../types";

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: (res) => {
      setAuth(res.user, res.accessToken);
      navigate("/");
      toast.success("Account created! Welcome aboard.");
    },
    onError: () => {
      toast.error("Registration failed. Email may already be in use.");
    },
  });
}

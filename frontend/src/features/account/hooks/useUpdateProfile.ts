import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/authStore";
import { accountService } from "../services/account.service";
import type { UpdateProfileDto } from "../types";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const accessToken = useAuthStore((s) => s.accessToken);

  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => accountService.updateProfile(dto),
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile"], updated);
      setAuth(updated, accessToken ?? "");
      toast.success("Profile updated.");
    },
    onError: () => {
      toast.error("Failed to update profile.");
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { accountService } from "../services/account.service";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: accountService.getProfile,
  });
}

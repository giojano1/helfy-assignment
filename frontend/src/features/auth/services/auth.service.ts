import apiClient from "../../../lib/axios";
import type { UserProfile } from "../../account/types";
import type { LoginFormData, RegisterFormData } from "../types";

interface AuthResponse {
  user: UserProfile;
  accessToken: string;
}

interface ApiEnvelope<T> {
  success: true;
  data: T;
}

export const authService = {
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiEnvelope<AuthResponse>>("/auth/register", data);
    return res.data.data;
  },

  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiEnvelope<AuthResponse>>("/auth/login", data);
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  getMe: async (): Promise<UserProfile> => {
    const res = await apiClient.get<ApiEnvelope<UserProfile>>("/auth/me");
    return res.data.data;
  },
};

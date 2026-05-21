import axios from "axios";
import apiClient from "../../../lib/axios";
import type { UserProfile } from "../../account/types";
import type { LoginFormData, RegisterFormData } from "../types";

interface AuthResponse {
  user: UserProfile;
  accessToken: string;
}

interface RefreshResponse {
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

  /** Exchange the httpOnly refresh cookie for a new access token. Uses raw axios to bypass apiClient interceptors. */
  refresh: async (): Promise<string> => {
    const url = `${import.meta.env.VITE_API_BASE_URL as string}/auth/refresh`;
    const res = await axios.post<ApiEnvelope<RefreshResponse>>(url, {}, { withCredentials: true });
    return res.data.data.accessToken;
  },
};

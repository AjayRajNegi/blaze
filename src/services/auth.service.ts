import { api } from "@/lib/axios";
import { LoginResponse } from "@/types";
import * as SecureStore from "expo-secure-store";

export const authService = {
  async register(data: {
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<LoginResponse> {
    console.log("AuthServices");
    const res = await api.post("/auth/register", data);
    await authService.saveTokens(
      res.data.data.accessToken,
      res.data.data.refreshToken,
    );

    console.log("auth.service.ts", res.data.data);
    return res.data.data;
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await api.post("/auth/login", { email, password });
    await authService.saveTokens(
      res.data.data.accessToken,
      res.data.data.refreshToken,
    );

    return res.data.data;
  },

  async logout(): Promise<void> {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (refreshToken) {
      await api.post("/auth/logout", { refreshToken }).catch(() => {});
    }
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  },

  async saveTokens(accessToken: string, refreshToken: string) {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
  },

  async getStoredToken() {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");

    return { accessToken, refreshToken };
  },
};

import { create } from "zustand";
import api from "../services/api";

export const useUserStore = create((set, get) => ({
  username: localStorage.getItem("username") || "Guest",
  avatarUrl: localStorage.getItem("avatar_url") || "",
  isAuthenticated: !!localStorage.getItem("access"),

  setProfile: (data) => {
    const username = data.username || "Guest";
    const avatarUrl = data.profile?.avatar_url || "";
    
    localStorage.setItem("username", username);
    localStorage.setItem("avatar_url", avatarUrl);

    set({ 
      username, 
      avatarUrl,
      isAuthenticated: !!localStorage.getItem("access")
    });
  },

  fetchProfile: async () => {
    try {
      const res = await api.get("auth/profile/");
      get().setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      // Fallback if not authenticated
      if (!localStorage.getItem("access")) {
        set({ username: "Guest", avatarUrl: "", isAuthenticated: false });
      }
    }
  },

  logout: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("avatar_url");
    localStorage.removeItem("is_admin");
    set({ username: "Guest", avatarUrl: "", isAuthenticated: false });
  }
}));

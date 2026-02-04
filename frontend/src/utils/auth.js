import api from "./api";   // ✅ centralized client

export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");

  if (!refresh) return null;

  try {
    const res = await api.post("/auth/refresh/", { refresh });

    const newAccess = res.data.access;
    localStorage.setItem("access", newAccess);   // keep consistent

    return newAccess;
  } catch {
    localStorage.clear();
    return null;
  }
};

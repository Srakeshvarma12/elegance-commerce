const apiBase =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")}/api`
    : "https://elegance-commerce.onrender.com/api");

const API_URL = apiBase;

export const login = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.detail || "Login failed");
  }

  // Store tokens in the format your app already uses
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  localStorage.setItem("username", data.username || "Account");

  // Now fetch profile to know if user is admin
  try {
    const userRes = await fetch(`${API_URL}/auth/profile/`, {
      headers: {
        Authorization: `Bearer ${data.access}`,
      },
    });

    if (userRes.ok) {
      const user = await userRes.json();
      localStorage.setItem("username", user.username || "Account");
      localStorage.setItem("is_admin", user.is_admin ? "true" : "false");
      return user;
    }
  } catch (err) {
    console.error("Profile fetch failed:", err);
  }

  localStorage.setItem("is_admin", data.is_admin ? "true" : "false");
  return data;
};

export const register = async (username, email, password) => {
  const res = await fetch(`${API_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.detail || "Registration failed");
  }

  return data;
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("username");
  localStorage.removeItem("is_admin");
};

export const getAuthState = () => {
  const token = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  return {
    isAuthenticated: !!token,
    isAdmin,
  };
};

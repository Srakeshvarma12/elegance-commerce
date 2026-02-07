const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://elegance-commerce.onrender.com/api";

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Login failed");
  }

  // ✅ MATCH THE REST OF YOUR APP
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);

  // Get user profile
  const userRes = await fetch(`${API_URL}/auth/me/`, {
    headers: {
      Authorization: `Bearer ${data.access}`,
    },
  });

  const user = await userRes.json();

  // Store what your Navbar & app actually use
  localStorage.setItem("username", user.username || "Account");
  localStorage.setItem("is_admin", user.is_staff ? "true" : "false");

  return user;
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

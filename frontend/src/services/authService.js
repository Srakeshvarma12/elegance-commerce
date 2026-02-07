const API_URL = import.meta.env.VITE_API_URL || "https://elegance-commerce.onrender.com/api";

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

  // STORE TOKEN
  localStorage.setItem("token", data.access);

  // STORE USER INFO (VERY IMPORTANT FOR ADMIN)
  const userRes = await fetch(`${API_URL}/auth/me/`, {
    headers: {
      Authorization: `Bearer ${data.access}`,
    },
  });

  const user = await userRes.json();
  localStorage.setItem("user", JSON.stringify(user));

  return user;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getAuthState = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return {
    isAuthenticated: !!token,
    isAdmin: user?.is_staff === true,
  };
};

import api from "./api";

// REGISTER USER
export const registerUser = async (userData) => {
  try {
    const res = await api.post("/auth/register/", userData);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.error || "Registration failed"
    );
  }
};

// LOGIN USER (ADMIN + NORMAL)
export const loginUser = async (userData) => {
  try {
    const res = await api.post("/auth/login/", userData);
    const data = res.data;

    localStorage.setItem("access", data.access);

    // Always store boolean as string
    localStorage.setItem(
      "isAdmin",
      data.is_admin ? "true" : "false"
    );

    localStorage.setItem("username", data.username);

    return data;
  } catch (err) {
    throw new Error(
      err.response?.data?.error || "Login failed"
    );
  }
};

// LOGOUT USER
export const logoutUser = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("username");
};

const API_URL = "http://127.0.0.1:8000/api/auth/";


// REGISTER USER
 
export const registerUser = async (userData) => {
  const res = await fetch(API_URL + "register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
};


// LOGIN USER (ADMIN + NORMAL)
 
export const loginUser = async (userData) => {
  const res = await fetch(API_URL + "login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  // ✅ STORE AUTH DATA
  localStorage.setItem("token", data.access);

  // Always store boolean as string
  localStorage.setItem(
    "isAdmin",
    data.is_admin ? "true" : "false"
  );

  localStorage.setItem("username", data.username);

  return data;
};


  // LOGOUT USER
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("username");
};

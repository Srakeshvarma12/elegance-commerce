export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");

  if (!refresh) return null;

  const res = await fetch("http://127.0.0.1:8000/api/auth/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    localStorage.clear();
    return null;
  }

  const data = await res.json();
  localStorage.setItem("token", data.access);
  return data.access;
};

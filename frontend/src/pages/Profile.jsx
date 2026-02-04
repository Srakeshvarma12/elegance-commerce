import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; 

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      navigate("/login");
      return;
    }

    api.get("/auth/profile/")
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem("access");
          navigate("/login");
        }
      });
  }, [navigate]);

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-serif mb-6">My Profile</h1>
      <div className="border rounded-2xl p-6 max-w-lg">
        <p><b>Username:</b> {user.username}</p>
        <p><b>Email:</b> {user.email}</p>
      </div>
    </div>
  );
}

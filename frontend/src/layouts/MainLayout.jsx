import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Toast />

      {/* 👉 THIS WRAPPER FIXES THE NAVBAR OVERLAP GLOBALLY */}
      <main className="min-h-screen bg-white pt-20">
        <Outlet />
      </main>
    </>
  );
}

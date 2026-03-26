import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import Footer from "../components/Footer";
import { useCartStore } from "../store/cartStore";

export default function MainLayout() {
  const loadCart = useCartStore(state => state.loadCart);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <>
      <Navbar />
      <Toast />
      <main className="min-h-screen bg-cream pt-24 page-enter">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

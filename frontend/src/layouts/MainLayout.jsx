import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import Footer from "../components/Footer";
import { useCartStore } from "../store/cartStore";

export default function MainLayout() {
  const loadCart = useCartStore(state => state.loadCart);
  const location = useLocation();

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <Toast />
      <main className="min-h-screen pt-[72px]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <p className="font-display text-2xl tracking-[0.4em] uppercase">
              Elegance
            </p>
            <p className="text-sm text-white/70 mt-4 leading-6">
              Curated luxury essentials crafted for modern living. Designed with
              restraint, finished with precision.
            </p>
          </div>

          <div>
            <p className="uppercase text-xs tracking-[0.3em] text-white/60">
              Explore
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <Link to="/shop" className="hover:text-white/70">
                Shop
              </Link>
              <a href="/#collections" className="hover:text-white/70">
                Collections
              </a>
              <a href="/#story" className="hover:text-white/70">
                Our Story
              </a>
              <a href="/#craft" className="hover:text-white/70">
                Craftsmanship
              </a>
            </div>
          </div>

          <div>
            <p className="uppercase text-xs tracking-[0.3em] text-white/60">
              Client Care
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <Link to="/account" className="hover:text-white/70">
                Account
              </Link>
              <Link to="/orders" className="hover:text-white/70">
                Orders
              </Link>
              <Link to="/wishlist" className="hover:text-white/70">
                Wishlist
              </Link>
              <Link to="/cart" className="hover:text-white/70">
                Cart
              </Link>
            </div>
          </div>

          <div>
            <p className="uppercase text-xs tracking-[0.3em] text-white/60">
              Newsletter
            </p>
            <p className="text-sm text-white/70 mt-4">
              Receive private previews and atelier releases.
            </p>
            <div className="mt-4 flex items-center gap-2 border border-white/30 px-3 py-2">
              <input
                className="bg-transparent flex-1 text-sm outline-none placeholder:text-white/40"
                placeholder="Email address"
              />
              <button className="text-xs uppercase tracking-[0.3em] text-white/80">
                Join
              </button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-white/60 text-xs uppercase tracking-[0.3em]">
              <span>Instagram</span>
              <span>LinkedIn</span>
              <span>WeChat</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between text-xs text-white/50 tracking-[0.3em] uppercase gap-4">
          <span>© 2026 Elegance Atelier</span>
          <span>Privacy · Terms · Shipping</span>
        </div>
      </div>
    </footer>
  );
}

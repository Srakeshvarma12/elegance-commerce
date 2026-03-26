import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useUserStore } from "../store/userStore";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = useCartStore(state => state.cartCount());
  const wishlistCount = useWishlistStore(state => state.items.length);

  const { username, avatarUrl, isAuthenticated, fetchProfile, logout: storeLogout } = useUserStore();
  const isAdmin = localStorage.getItem("is_admin") === "true";

  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const isHome = location.pathname === "/";

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const close = e => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("is_admin");
    navigate("/login");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "submit") {
      if (searchQuery.trim()) {
        navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        setOpenMenu(false);
        setSearchQuery("");
      }
    }
  };

  const navIsSolid = !isHome || scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        navIsSolid
          ? "bg-cream/90 text-ink shadow-sm backdrop-blur-xl border-b border-black/5"
          : "bg-gradient-to-b from-black/80 via-black/30 to-transparent text-white"
      }`}
    >
      <div className="h-20 px-6 md:px-12 flex items-center justify-between gap-6">
        <Link
          to="/"
          className="shrink-0 font-display text-lg md:text-xl tracking-[0.5em] uppercase drop-shadow-md"
        >
          Elegance
        </Link>

        {/* Desktop Links - Minimal */}
        <div className="hidden lg:flex items-center gap-10">
          <Link to="/shop" className="text-[11px] font-medium tracking-[0.3em] uppercase opacity-80 hover:opacity-100 transition drop-shadow-sm">
            Shop
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className={`w-full py-2 pl-10 pr-4 bg-black/5 hover:bg-black/10 focus:bg-white/10 border-b border-transparent focus:border-gold/50 outline-none transition-all rounded-full text-xs placeholder:text-current/40 ${
              navIsSolid ? "text-ink" : "text-white"
            }`}
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => navigate("/wishlist")}
            className="relative flex items-center justify-center w-9 h-9"
            aria-label="Wishlist"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.8 4.6c-1.9-1.9-5-1.9-6.9 0l-1 1-1-1c-1.9-1.9-5-1.9-6.9 0-1.9 1.9-1.9 5 0 6.9l7.9 7.9 7.9-7.9c1.9-1.9 1.9-5 0-6.9z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--color-gold)] text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-[var(--color-ink)]">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center justify-center w-9 h-9"
            aria-label="Cart"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6h15l-1.5 9H7.5L6 6z" />
              <path d="M6 6L4.5 3H2" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--color-gold)] text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-[var(--color-ink)]">
                {cartCount}
              </span>
            )}
          </button>

          {isAuthenticated && isAdmin && (
            <button
              onClick={() => navigate("/admin-panel")}
              className="hidden md:block text-[10px] uppercase tracking-[0.4em] hover:opacity-70"
            >
              Admin
            </button>
          )}

          {isAuthenticated ? (
            <div ref={profileRef} className="relative hidden md:block">
              <button
                onClick={() => setOpenProfile(p => !p)}
                className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center overflow-hidden hover:border-black/30 transition shadow-sm bg-white"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c1.8-4 6-6 8-6s6.2 2 8 6" />
                  </svg>
                )}
              </button>

              {openProfile && (
                <div className="absolute right-0 mt-3 w-56 bg-white text-[var(--color-ink)] border border-black/10 shadow-xl overflow-hidden rounded-lg">
                  <div className="px-4 py-4 bg-black/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-black/10">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px]">IN</div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] uppercase tracking-widest text-black/40">Logged in as</span>
                      <span className="text-xs font-medium truncate">{username}</span>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full text-left px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-black/5 transition"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => navigate("/account")}
                      className="w-full text-left px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-black/5 transition"
                    >
                      Orders
                    </button>
                    <div className="h-px bg-black/5 mx-4 my-1" />
                    <button
                      onClick={() => {
                        storeLogout();
                        navigate("/login");
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs uppercase tracking-widest text-red-600 hover:bg-black/5 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-2 border border-black/20 px-5 py-2 text-[10px] uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all rounded-full"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={() => setOpenMenu(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center"
            aria-label="Open menu"
          >
            <span className="block w-5 h-px bg-current mb-1" />
            <span className="block w-5 h-px bg-current" />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 transition ${
          openMenu ? "visible bg-black/40" : "invisible bg-transparent"
        }`}
        onClick={() => setOpenMenu(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-[var(--color-cream)] shadow-2xl p-8 transform transition-transform duration-500 ${
            openMenu ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <span className="font-display uppercase tracking-[0.4em] text-sm">
              Menu
            </span>
            <button onClick={() => setOpenMenu(false)} className="text-sm">
              Close
            </button>
          </div>

          <div className="mt-10 flex flex-col gap-6 text-sm uppercase tracking-[0.35em]">
            {/* Mobile Search */}
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(e); }} className="relative mb-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-10 pr-4 bg-black/5 border border-black/10 rounded-lg outline-none text-xs"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </form>

            <button
              onClick={() => {
                setOpenMenu(false);
                navigate("/shop");
              }}
              className="text-left"
            >
              Shop All
            </button>
            <button
              onClick={() => {
                setOpenMenu(false);
                navigate("/wishlist");
              }}
            >
              Wishlist ({wishlistCount})
            </button>
            <button
              onClick={() => {
                setOpenMenu(false);
                navigate("/cart");
              }}
            >
              Cart ({cartCount})
            </button>
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/account");
                  }}
                >
                  Account
                </button>
                <button
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/orders");
                  }}
                >
                  Orders
                </button>
                <button
                  onClick={() => {
                    setOpenMenu(false);
                    logout();
                  }}
                  className="text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setOpenMenu(false);
                  navigate("/login");
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

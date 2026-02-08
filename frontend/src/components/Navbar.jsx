import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useState, useEffect, useRef } from "react";
import { getAuthState } from "../services/authService";

export default function Navbar() {
  const navigate = useNavigate();

  const cartCount = useCartStore(state => state.cartCount());
  const wishlistCount = useWishlistStore(state => state.items.length);

  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username") || "Account";

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [showSearch, setShowSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const { isAuthenticated, isAdmin } = getAuthState();

  // Close profile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSearch &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch]);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("is_admin");
    setOpenMenu(false);
    setOpenProfile(false);
    navigate("/login");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.append("search", query.trim());
    if (category !== "all") params.append("category", category);
    navigate(`/shop?${params.toString()}`);
    setShowSearch(false);
    setOpenMenu(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-black z-50">
      <div className="h-20 px-4 md:px-10 flex items-center justify-between gap-4">

        {/* LOGO */}
        <Link
          to="/"
          className="text-xl md:text-2xl font-serif tracking-widest hover:opacity-70 transition whitespace-nowrap"
        >
          ÉLÉGANCE
        </Link>

        {/* MOBILE SEARCH TOGGLE */}
        <button
          onClick={() => setShowSearch(s => !s)}
          className="md:hidden text-xl"
        >
          {/* 🔍 */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </button>

        {/* DESKTOP SEARCH */}
        <div className="hidden md:flex items-center gap-3 w-full max-w-xl mx-6">
          <input
            type="text"
            placeholder="Search products"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            className="flex-1 border border-black px-4 py-2 text-sm outline-none"
          />

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border border-black px-3 py-2 text-sm cursor-pointer"
          >
            <option value="all">All</option>
            <option value="fashion">Fashion</option>
            <option value="watches">Watches</option>
            <option value="shoes">Shoes</option>
          </select>

          <button
            onClick={handleSearch}
            className="border border-black px-5 py-2 text-sm hover:bg-black hover:text-white transition"
          >
            Search
          </button>
        </div>

        {/* ACTION ICONS */}
        <div className="flex items-center gap-4 md:gap-8">

          <Link to="/shop" className="hidden md:inline hover:opacity-70">
            🛍️ SHOP
          </Link>

          <button
            onClick={() => navigate("/wishlist")}
            className="relative text-xl"
          >
            🖤
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="relative text-lg md:text-base"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* ADMIN — SHOW ONLY ON DESKTOP */}
          {isAuthenticated && isAdmin && (
            <button
              onClick={() => navigate("/admin-panel")}
              className="text-sm font-medium"
            >
              ADMIN PANEL
            </button>
          )}

          {/* PROFILE */}
          {token && (
            <div ref={profileRef} className="relative hidden md:block">
              <button
                onClick={() => setOpenProfile(p => !p)}
                className="w-11 h-11 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition"
                title={username}
              >
                👤
              </button>

              {openProfile && (
                <div className="absolute right-0 mt-3 w-48 border bg-white shadow-xl">
                  <button
                    onClick={() => { navigate("/account"); setOpenProfile(false); }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100"
                  >
                    My Account
                  </button>

                  <button
                    onClick={() => { navigate("/orders"); setOpenProfile(false); }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100"
                  >
                    Orders
                  </button>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {!token && (
            <Link
              to="/login"
              className="border border-black px-4 md:px-6 py-2 text-xs md:text-sm hover:bg-black hover:text-white transition"
            >
              LOGIN
            </Link>
          )}

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setOpenMenu(true)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH PANEL */}
      {showSearch && (
        <div
          ref={searchRef}
          className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-black bg-white"
        >
          <input
            type="text"
            placeholder="Search products"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full border border-black px-4 py-2 text-sm"
          />

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border border-black px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="fashion">Fashion</option>
            <option value="watches">Watches</option>
            <option value="electronics">Electronics</option>
          </select>

          <button
            onClick={handleSearch}
            className="border border-black px-5 py-2 text-sm hover:bg-black hover:text-white transition"
          >
            Search
          </button>
        </div>
      )}

      {/* MOBILE SLIDE MENU */}
      {openMenu && (
        <div className="fixed inset-0 bg-black/40 z-50">
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl p-6">
            <button
              onClick={() => setOpenMenu(false)}
              className="mb-6 text-xl"
            >
              ✕ Close
            </button>

            <div className="flex flex-col gap-6 text-lg">

              <button onClick={() => { navigate("/shop"); setOpenMenu(false); }}>
                🛍️ Shop
              </button>

              <button onClick={() => { navigate("/cart"); setOpenMenu(false); }}>
                🛒 Cart ({cartCount})
              </button>

              <button onClick={() => { navigate("/wishlist"); setOpenMenu(false); }}>
                ❤️ Wishlist ({wishlistCount})
              </button>

              {/* ADMIN — MOBILE ONLY INSIDE HAMBURGER */}
              {isAuthenticated && isAdmin && (
                <button
                  onClick={() => { navigate("/admin-panel"); setOpenMenu(false); }}
                  className="font-semibold"
                >
                  ADMIN PANEL
                </button>
              )}

              {token && (
                <>
                  <button onClick={() => { navigate("/account"); setOpenMenu(false); }}>
                    My Account
                  </button>

                  <button onClick={() => { navigate("/orders"); setOpenMenu(false); }}>
                    Orders
                  </button>

                  <button onClick={logout} className="text-red-600">
                    Logout
                  </button>
                </>
              )}

              {!token && (
                <button onClick={() => { navigate("/login"); setOpenMenu(false); }}>
                  Login
                </button>
              )}

            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

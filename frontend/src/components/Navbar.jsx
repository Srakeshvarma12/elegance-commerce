import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useUserStore } from "../store/userStore";
import { useEffect, useRef, useState } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function Navbar() {
  const navigate = useNavigate();
  const cartCount = useCartStore(state => state.cartCount());
  const wishlistCount = useWishlistStore(state => state.items.length);
  const { username, avatarUrl, isAuthenticated, fetchProfile, logout: storeLogout } = useUserStore();

  const [openProfile, setOpenProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) fetchProfile();
  }, [isAuthenticated, fetchProfile]);

  useEffect(() => {
    const close = e => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "submit") {
      if (searchQuery.trim()) {
        navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery("");
        setMobileSearchOpen(false);
      }
    }
  };

  const glassHover = {
    onMouseEnter: e => {
      e.currentTarget.style.background = "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.35) 100%)";
      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.7)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.boxShadow = "none";
    }
  };

  const searchInputStyle = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.4) 100%)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    border: "1px solid rgba(255,255,255,0.5)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.02)"
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-gradient-to-b from-white/75 via-white/60 to-white/50 backdrop-blur-3xl saturate-[200%] border-b border-white/40"
            : "bg-gradient-to-b from-white/40 to-white/20 backdrop-blur-2xl saturate-[180%] border-b border-white/15"
        }`}
        style={{
          boxShadow: scrolled
            ? "0 1px 0 rgba(255,255,255,0.5) inset, 0 -1px 0 rgba(0,0,0,0.03) inset, 0 4px 20px rgba(0,0,0,0.06)"
            : "0 1px 0 rgba(255,255,255,0.3) inset"
        }}
      >
        {/* Glossy top-edge shine */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.9) 70%, transparent 95%)"
          }}
        />

        <div className="section-container flex items-center justify-between h-[60px] md:h-[72px] gap-3 md:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 group">
            <span className="text-[1.1rem] md:text-[1.35rem] font-bold tracking-[-0.04em] text-text-primary drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
              ELEGANCE
            </span>
          </Link>

          {/* Desktop Search — visible on md+ */}
          <div className="flex-1 max-w-lg relative hidden md:block">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full py-2.5 pl-10 pr-5 text-sm rounded-full outline-none transition-all placeholder:text-text-muted"
              style={searchInputStyle}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 md:gap-1.5">
            {/* Mobile Search Toggle — visible only on < md */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className={`md:hidden relative p-2 transition-all duration-300 rounded-full ${mobileSearchOpen ? "text-text-primary" : "text-text-secondary"}`}
              {...glassHover}
              aria-label="Search"
            >
              {mobileSearchOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              )}
            </button>

            {/* Shop link — hidden on small */}
            <Link
              to="/shop"
              className="hidden sm:flex items-center px-3.5 py-2 text-[0.8125rem] font-medium text-text-secondary hover:text-text-primary transition-all duration-300 rounded-full"
              {...glassHover}
            >
              Shop
            </Link>

            {/* Wishlist */}
            <button
              onClick={() => navigate("/wishlist")}
              className="relative p-2 md:p-2.5 text-text-secondary hover:text-text-primary transition-all duration-300 rounded-full"
              {...glassHover}
              aria-label="Wishlist"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 md:p-2.5 text-text-secondary hover:text-text-primary transition-all duration-300 rounded-full"
              {...glassHover}
              aria-label="Cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-text-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div ref={profileRef} className="relative ml-0.5 md:ml-1">
                <button
                  onClick={() => setOpenProfile(!openProfile)}
                  className="flex items-center gap-2 py-1.5 pl-2 md:pl-3 pr-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.30) 100%)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    border: "1px solid rgba(255,255,255,0.45)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.7)"
                  }}
                >
                  <span className="text-[0.8125rem] font-medium text-text-secondary hidden md:block">{username}</span>
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-bg-subtle overflow-hidden flex items-center justify-center">
                    {avatarUrl
                      ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                      : <span className="text-xs font-semibold text-text-muted">{username?.charAt(0)?.toUpperCase()}</span>
                    }
                  </div>
                </button>

                {openProfile && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden animate-slideDown"
                    style={{
                      background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 100%)",
                      backdropFilter: "blur(40px) saturate(200%)",
                      WebkitBackdropFilter: "blur(40px) saturate(200%)",
                      border: "1px solid rgba(255,255,255,0.5)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)"
                    }}
                  >
                    <div className="p-3 border-b border-white/30">
                      <p className="text-sm font-semibold">{username}</p>
                      <p className="text-xs text-text-muted">Member</p>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { navigate("/profile"); setOpenProfile(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/60 transition-colors">Profile</button>
                      <button onClick={() => { navigate("/account"); setOpenProfile(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/60 transition-colors">My Orders</button>
                      <button onClick={() => { navigate("/wishlist"); setOpenProfile(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/60 transition-colors">Wishlist</button>
                    </div>
                    <div className="border-t border-white/30 py-1">
                      <button
                        onClick={() => { storeLogout(); navigate("/login"); setOpenProfile(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-red-50/60 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <LiquidButton
                size="sm"
                onClick={() => navigate('/login')}
                className="!text-text-primary font-semibold ml-0.5 md:ml-1 text-xs md:text-sm"
              >
                Sign In
              </LiquidButton>
            )}
          </div>
        </div>
      </nav>

      {/* ═══ Mobile Search Drawer ═══ */}
      <div
        className={`fixed top-[60px] left-0 right-0 z-40 md:hidden transition-all duration-300 ease-out ${
          mobileSearchOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.75) 100%)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderBottom: "1px solid rgba(255,255,255,0.4)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)"
        }}
      >
        <div className="section-container py-3">
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={mobileSearchRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full py-3 pl-10 pr-12 text-sm rounded-2xl outline-none transition-all placeholder:text-text-muted"
              style={searchInputStyle}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop overlay when mobile search is open */}
      {mobileSearchOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/10 md:hidden"
          onClick={() => setMobileSearchOpen(false)}
        />
      )}
    </>
  );
}

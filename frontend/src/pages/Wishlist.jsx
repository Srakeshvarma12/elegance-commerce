import { Link, useNavigate } from "react-router-dom";
import { useWishlistStore } from "../store/wishlistStore";
import ProductCard from "../components/ProductCard";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlistStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="section-container pt-12 pb-8 md:pt-16 md:pb-10">
        <p className="label mb-2">Saved</p>
        <h1 className="heading-xl">Wishlist</h1>
      </header>

      {items.length === 0 ? (
        <div className="section-container pb-20">
          <div className="card p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-bg-subtle flex items-center justify-center mx-auto mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>
            <p className="text-text-muted mb-6">Your wishlist is empty</p>
            <LiquidButton size="lg" onClick={() => navigate('/shop')} className="!text-text-primary font-semibold">Browse Products</LiquidButton>
          </div>
        </div>
      ) : (
        <div className="section-container pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="relative group">
              <Link to={`/product/${item.id}`}>
                <ProductCard product={item} />
              </Link>
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-error shadow-sm opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-error hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

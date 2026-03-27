import { Link, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useToastStore } from "../store/toastStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useEffect, useState } from "react";
import { getProductById } from "../services/productService";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore(state => state.addToCart);
  const showToast = useToastStore(state => state.showToast);

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getProductById(id)
      .then(data => {
        setProduct(data);
        setVariants(data.variants || []);
        if (data.variants?.length) {
          setSelectedSize(data.variants[0].size);
          setSelectedColor(data.variants[0].color);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const sizes = [...new Set(variants.map(v => v.size))].filter(Boolean);
  const colors = [...new Set(variants.map(v => v.color))].filter(Boolean);

  const handleAddToCart = (redirect = false) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    showToast(`${product.name} added to cart`);
    if (redirect) navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-text-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-text-muted">Product not found.</p>
        <LiquidButton size="lg" onClick={() => navigate('/shop')} className="!text-text-primary font-medium">Back to Shop</LiquidButton>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="section-container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link to="/" className="hover:text-text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-text-primary transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-text-primary font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Image Gallery */}
          <div className="bg-bg-subtle rounded-2xl p-8 md:p-12 flex items-center justify-center min-h-[500px] lg:min-h-[600px] group sticky top-[88px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain max-h-[500px] transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>

          {/* Product Info */}
          <div className="py-4 lg:py-8">
            <div className="mb-8">
              <p className="label mb-3 text-accent">{product.category}</p>
              <h1 className="heading-lg mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-bold">${product.price}</span>
                <span className="text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">
                  In Stock
                </span>
              </div>
              <p className="body-sm max-w-md">{product.description}</p>
            </div>

            <div className="h-px bg-border my-8" />

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mb-8">
                <label className="form-label mb-3">Size</label>
                <div className="flex flex-wrap gap-2.5">
                  {sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        selectedSize === s
                          ? "bg-text-primary text-white border-text-primary"
                          : "bg-white border-border hover:border-border-strong"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selector */}
            {colors.length > 0 && (
              <div className="mb-8">
                <label className="form-label mb-3">Color</label>
                <div className="flex flex-wrap gap-2.5">
                  {colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        selectedColor === c
                          ? "bg-text-primary text-white border-text-primary"
                          : "bg-white border-border hover:border-border-strong"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-10">
              <LiquidButton size="xl" onClick={() => handleAddToCart(false)} className="!text-text-primary font-semibold flex-1">
                Add to Cart
              </LiquidButton>
              <LiquidButton size="xl" onClick={() => handleAddToCart(true)} className="!text-text-secondary font-medium flex-1">
                Buy Now
              </LiquidButton>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 bg-bg-subtle rounded-xl p-6 flex flex-col gap-5">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-0.5">1-Year Warranty</h4>
                  <p className="text-xs text-text-muted leading-relaxed">Full coverage on all parts and labor.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-0.5">Free Shipping</h4>
                  <p className="text-xs text-text-muted leading-relaxed">Complimentary delivery on all orders.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8m0-5v5h5"/></svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-0.5">30-Day Returns</h4>
                  <p className="text-xs text-text-muted leading-relaxed">Hassle-free returns within 30 days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

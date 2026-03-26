import { Link, useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useToastStore } from "../store/toastStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useUserStore } from "../store/userStore";

const starPath =
  "M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3z";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const addToCart = useCartStore(state => state.addToCart);
  const showToast = useToastStore(state => state.showToast);

  const addItem = useWishlistStore(state => state.addItem);
  const removeItem = useWishlistStore(state => state.removeItem);
  const wishlistItems = useWishlistStore(state => state.items);

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [cartError, setCartError] = useState("");
  const [reviewError, setReviewError] = useState("");

  const token = localStorage.getItem("access");

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setSelectedSize(null);
    setSelectedColor(null);
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    api
      .get(`products/${id}/`)
      .then(res => {
        if (!isMounted) return;
        setProduct(res.data);
        setVariants(res.data.variants || []);
      })
      .catch(() => {
        if (!isMounted) return;
        setProduct(null);
        setError("This product is unavailable.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    api
      .get(`reviews/product/${id}/`)
      .then(res => setReviews(res.data))
      .catch(() => setReviews([]));
  }, [id]);

  useEffect(() => {
    if (!token) {
      const exists = wishlistItems.some(item => item.product === Number(id));
      setIsWishlisted(exists);
      return;
    }

    api
      .get("wishlist/my/")
      .then(res => {
        const exists = res.data.some(item => item.product === Number(id));
        setIsWishlisted(exists);
      })
      .catch(() => setIsWishlisted(false));
  }, [id, token, wishlistItems]);

  const toggleWishlist = async () => {
    if (wishlistLoading || !product) return;
    setWishlistLoading(true);

    try {
      if (token) {
        await api.post(`wishlist/toggle/${product.id}/`);
      }

      if (isWishlisted) {
        removeItem(product.id);
        showToast("Removed from wishlist");
      } else {
        addItem({
          product: product.id,
          product_name: product.name,
          product_price: product.price,
          product_image: product.image,
        });
        showToast("Added to wishlist");
      }

      setIsWishlisted(prev => !prev);
    } catch (err) {
      showToast("Action failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  const sizes = [...new Set(variants.map(v => v.size))].filter(Boolean);
  const colors = [...new Set(variants.map(v => v.color))].filter(Boolean);

  const handleAddToCart = (redirect = false) => {
    const requireSize = sizes.length > 0;
    const requireColor = colors.length > 0;

    if ((requireSize && !selectedSize) || (requireColor && !selectedColor)) {
      setCartError("Please select size and color.");
      return;
    }

    setCartError("");

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    showToast("Added to cart");
    if (redirect) navigate("/cart");
  };

  const submitReview = async () => {
    if (!token) {
      setReviewError("Please sign in to leave a review.");
      return;
    }

    if (!rating) {
      setReviewError("Please select a rating.");
      return;
    }

    try {
      const res = await api.post(`reviews/product/${id}/add/`, {
        rating,
        comment,
      });

      setReviews(prev => [res.data, ...prev]);
      setRating(0);
      setComment("");
      setReviewError("");
    } catch (err) {
      setReviewError(
        err.response?.data?.error || "You already reviewed this product."
      );
    }
  };

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
    return total / reviews.length;
  }, [reviews]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-[10px] uppercase tracking-widest text-muted animate-pulse">Loading piece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-muted text-sm mb-8">{error || "Product not found."}</p>
        <button onClick={() => navigate("/shop")} className="btn-elegant inline-block text-[10px]">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 flex items-center justify-between">
        <button 
          className="text-[10px] uppercase tracking-[0.2em] text-muted hover:text-ink transition flex items-center gap-2"
          onClick={() => navigate("/shop")}
        >
          <span className="text-base">←</span> Back to Collection
        </button>
        <span className="text-[10px] uppercase tracking-[0.4em] text-muted opacity-50">
          {product.category || "Design"} No. {product.id}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-32">
        <div className="sticky top-28 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-black/5 overflow-hidden shadow-sm group">
          <div className="aspect-[4/5] overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition duration-1000 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="flex flex-col gap-10 py-6">
          <header>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-6 opacity-70">{product.category || "Curated Pieces"}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display mb-8 text-ink leading-[1.1]">{product.name}</h1>
            <div className="flex items-center justify-between border-b border-black/5 pb-8 mb-8">
              <span className="text-2xl font-display tracking-widest text-ink">INR {product.price}</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" className={`w-3 h-3 ${i < Math.round(averageRating) ? "fill-ink" : "fill-black/10"}`}>
                      <path d={starPath} />
                    </svg>
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted font-medium">({reviews.length} Reviews)</span>
              </div>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-lg">
              {product.description || "A masterclass in form and functionality, this piece embodies our commitment to refined aesthetics and enduring quality."}
            </p>
          </header>

          <div className="flex flex-col gap-8">
            {sizes.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted mb-4 ml-1">Size Option</p>
                <div className="flex flex-wrap gap-3">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest transition-all duration-300 border ${
                        selectedSize === size 
                          ? "bg-ink text-white border-ink shadow-lg shadow-black/10" 
                          : "bg-white text-ink border-black/5 hover:border-black/20"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted mb-4 ml-1">Color Palette</p>
                <div className="flex flex-wrap gap-3">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest transition-all duration-300 border ${
                        selectedColor === color 
                          ? "bg-ink text-white border-ink shadow-lg shadow-black/10" 
                          : "bg-white text-ink border-black/5 hover:border-black/20"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted mb-4 ml-1">Quantity</p>
              <div className="flex items-center bg-black/5 w-fit rounded-2xl px-4 py-3 gap-6">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-ink/40 hover:text-ink transition text-lg"
                >–</button>
                <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 flex items-center justify-center text-ink/40 hover:text-ink transition text-lg"
                >+</button>
              </div>
            </div>
          </div>

          {cartError && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-red-600 text-[10px] uppercase tracking-widest text-center">
              {cartError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => handleAddToCart(false)}
              className="flex-1 btn-elegant py-5 bg-ink text-white shadow-xl shadow-black/10 text-[10px]"
            >
              Add to Collection
            </button>
            <button
              onClick={() => handleAddToCart(true)}
              className="flex-1 btn-elegant py-5 bg-white text-ink border border-black/10 text-[10px] hover:bg-black/5 overflow-hidden"
            >
              Express Purchase
            </button>
            <button
              onClick={toggleWishlist}
              className={`w-16 h-[60px] flex items-center justify-center rounded-[1.2rem] border transition-all duration-500 ${
                isWishlisted ? "bg-red-50 border-red-100 text-red-500 shadow-inner" : "bg-white border-black/10 text-ink hover:scale-105"
              }`}
              aria-label="Toggle wishlist"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  d="M12 21s-7-4.5-7-9a4 4 0 0 1 7-2.7A4 4 0 0 1 19 11c0 4.5-7 9-7 9z"
                  fill={isWishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <section className="border-t border-black/5 pt-24 pb-32">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-4 opacity-70">Dialogue</p>
            <h2 className="text-4xl font-display text-ink">Customer Insights</h2>
          </div>
          <p className="text-muted text-[10px] uppercase tracking-widest font-medium">Verified Reviews • {reviews.length} Entries</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-20 items-start">
          <div className="flex flex-col gap-8">
            {reviews.length === 0 ? (
              <div className="text-center py-24 bg-white/30 rounded-[2.5rem] border border-dashed border-black/10">
                <p className="text-muted text-xs uppercase tracking-widest">Awaiting first review.</p>
              </div>
            ) : (
              reviews.map(r => (
                <div key={r.id} className="bg-white/50 backdrop-blur-sm rounded-[2rem] border border-black/5 p-10 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-xs font-display tracking-widest text-ink mb-1">{r.user_username || r.user_name || "Anonymous Guest"}</h4>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-muted opacity-60">Verified Purchase</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" className={`w-2.5 h-2.5 ${i < r.rating ? "fill-ink" : "fill-black/5"}`}>
                          <path d={starPath} />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-muted text-sm leading-relaxed">{r.comment}</p>}
                </div>
              ))
            )}
          </div>

          <aside className="bg-white rounded-[2.5rem] border border-black/10 p-10 shadow-lg sticky top-28">
            <h3 className="text-[10px] uppercase tracking-[0.4em] mb-8 pb-4 border-b border-black/5 opacity-60">Share Experience</h3>
            
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-widest text-muted mb-4 ml-1">Rating</p>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => setRating(num)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      num <= rating ? "bg-ink text-white scale-110 shadow-lg" : "bg-black/5 text-ink/20 hover:text-ink/40"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d={starPath} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-widest text-muted mb-4 ml-1">Remarks</p>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your thoughts on this piece..."
                className="w-full bg-black/5 border-none px-5 py-5 rounded-2xl text-xs min-h-[140px] focus:ring-1 ring-ink/10 outline-none transition resize-none"
              />
            </div>

            {reviewError && (
              <p className="mb-6 text-[9px] uppercase tracking-widest text-red-500 text-center leading-relaxed">
                {reviewError}
              </p>
            )}

            <button 
              onClick={submitReview} 
              className="btn-elegant w-full py-5 bg-ink text-white shadow-xl shadow-black/10 text-[10px]"
            >
              Publish Review
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
}

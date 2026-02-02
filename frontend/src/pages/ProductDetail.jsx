import { useParams, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useToastStore } from "../store/toastStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useEffect, useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const addToCart = useCartStore(state => state.addToCart);
  const showToast = useToastStore(state => state.showToast);

  const addItem = useWishlistStore(state => state.addItem);
  const removeItem = useWishlistStore(state => state.removeItem);

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [reviews, setReviews] = useState([]);

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
    fetch(`http://127.0.0.1:8000/api/products/${id}/`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setVariants(data.variants || []);
      })
      .catch(() => setProduct(null));
  }, [id]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/reviews/product/${id}/`)
      .then(res => res.json())
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [id]);

  useEffect(() => {
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/wishlist/my/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => (res.ok ? await res.json() : []))
      .then(data => {
        const exists = data.some(item => item.product === Number(id));
        setIsWishlisted(exists);
      });
  }, [id, token]);

  const toggleWishlist = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (wishlistLoading || !product) return;
    setWishlistLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/wishlist/toggle/${product.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (!res.ok) return;

      if (isWishlisted) {
        removeItem(product.id);
        showToast("Removed from wishlist");
      } else {
        addItem({ product: product.id });
        showToast("Added to wishlist");
      }

      setIsWishlisted(prev => !prev);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (!product) {
    return <div className="p-20 text-center">Product not found</div>;
  }

  const sizes = [...new Set(variants.map(v => v.size))];
  const colors = [...new Set(variants.map(v => v.color))];

  const handleAddToCart = (redirect = false) => {
    if (!selectedSize || !selectedColor) {
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
      navigate("/login");
      return;
    }

    if (!rating) {
      setReviewError("Please select a rating.");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/reviews/product/${id}/add/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setReviewError(data.error || "You already reviewed this product.");
        return;
      }

      setReviews(prev => [data, ...prev]);
      setRating(0);
      setComment("");
      setReviewError("");
    } catch {
      setReviewError("Unable to submit review. Try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen">

      {/* BACK BUTTON */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-20">
        <button
          onClick={() => navigate(-1)}
          className="text-sm underline"
        >
          ← Back
        </button>
      </div>

      {/* PRODUCT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

        {/* IMAGE */}
        <div className="bg-gray-100 aspect-square overflow-hidden w-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-4 md:space-y-6">

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif uppercase tracking-widest">
            {product.name}
          </h1>

          <p className="text-gray-600 text-sm sm:text-base">
            {product.description}
          </p>

          <p className="text-xl md:text-2xl font-semibold">
            ${product.price}
          </p>

          {/* SIZE */}
          <div>
            <p className="uppercase text-xs sm:text-sm mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-2 text-sm border ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* COLOR */}
          <div>
            <p className="uppercase text-xs sm:text-sm mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-2 text-sm border ${
                    selectedColor === color
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div>
            <p className="uppercase text-xs sm:text-sm mb-2">Quantity</p>
            <div className="flex items-center border w-fit">
              <button
                onClick={() =>
                  setQuantity(q => Math.max(1, q - 1))
                }
                className="w-10 h-10 md:w-12 md:h-12"
              >
                −
              </button>
              <span className="w-10 md:w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 md:w-12 md:h-12"
              >
                +
              </button>
            </div>
          </div>

          {cartError && (
            <p className="text-red-600 text-sm">{cartError}</p>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3 md:gap-4">

            <button
              onClick={() => handleAddToCart(false)}
              className="border px-6 py-3 md:px-10 md:py-4 uppercase text-sm"
            >
              Add to Cart
            </button>

            <button
              onClick={() => handleAddToCart(true)}
              className="bg-black text-white px-6 py-3 md:px-10 md:py-4 uppercase text-sm"
            >
              Buy Now
            </button>

            <button
              onClick={toggleWishlist}
              className="w-12 h-12 md:w-14 md:h-14 border flex items-center justify-center text-2xl hover:scale-110 transition"
            >
              {isWishlisted ? "❤️" : "🖤"}
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pb-16">

        <h2 className="text-2xl md:text-3xl font-serif mb-6 md:mb-8">
          Customer Reviews
        </h2>

        {/* ADD REVIEW BOX */}
        <div className="border p-4 md:p-6 mb-10 max-w-xl">

          <p className="mb-2 uppercase text-xs md:text-sm">Your Rating</p>

          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => setRating(num)}
                className={`text-xl md:text-2xl ${
                  num <= rating
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full border p-3 mb-4 text-sm"
          />

          {reviewError && (
            <p className="text-red-600 mb-4 text-sm">{reviewError}</p>
          )}

          <button
            onClick={submitReview}
            className="border px-6 py-3 uppercase text-sm hover:bg-black hover:text-white"
          >
            Submit Review
          </button>
        </div>

        {/* REVIEW LIST */}
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-6 md:space-y-8">
            {reviews.map(r => (
              <div key={r.id} className="border-b pb-4 md:pb-6">
                <p className="font-medium text-sm md:text-base">
                  {r.user_username || r.user_name || "User"}
                </p>

                <p className="text-yellow-500 text-sm md:text-base">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </p>

                {r.comment && (
                  <p className="mt-2 text-gray-600 text-sm md:text-base">
                    {r.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

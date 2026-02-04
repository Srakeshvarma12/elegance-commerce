import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useToastStore } from "../store/toastStore";
import api from "../services/api"; 

export default function Wishlist() {
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  // 🛒 CART
  const addToCart = useCartStore(state => state.addToCart);

  // ❤️ WISHLIST STORE
  const items = useWishlistStore(state => state.items);
  const setWishlist = useWishlistStore(state => state.setWishlist);
  const removeItem = useWishlistStore(state => state.removeItem);

  // 🔔 TOAST
  const showToast = useToastStore(state => state.showToast);

  // UI STATE
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH WISHLIST
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    api.get("/wishlist/my/")
      .then(res => {
        setWishlist(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Unable to load wishlist");
        }
        setLoading(false);
      });
  }, [token, navigate, setWishlist]);

  // REMOVE FROM WISHLIST
  const removeFromWishlist = async (productId) => {
    try {
      await api.post(`/wishlist/toggle/${productId}/`);

      removeItem(productId);
      showToast("Removed from wishlist");
    } catch {
      showToast("Action failed");
    }
  };

  // ADD TO CART AND REMOVE FROM WISHLIST
  const handleAddToCart = async (item) => {
    addToCart({
      id: item.product,
      name: item.product_name,
      price: item.product_price,
      image: item.product_image,
      quantity: 1,
    });

    try {
      await api.post(`/wishlist/toggle/${item.product}/`);

      removeItem(item.product);
      showToast("Added to cart");
    } catch {
      showToast("Action failed");
    }
  };

  // UI STATES
  if (loading) {
    return (
      <div className="p-32 text-center">
        Loading wishlist...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-32 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <h1 className="text-3xl font-serif mb-12">
        My Wishlist
      </h1>

      {items.length === 0 && (
        <p className="text-gray-500">
          Your wishlist is empty.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
        {items.map(item => (
          <div
            key={item.id}
            className="border p-4 flex flex-col"
          >
            {/* IMAGE → PRODUCT DETAIL */}
            <img
              src={item.product_image}
              alt={item.product_name}
              onClick={() =>
                navigate(`/product/${item.product}`)
              }
              className="cursor-pointer h-64 object-cover hover:opacity-90 transition"
            />

            <p className="mt-4 uppercase tracking-widest text-sm">
              {item.product_name}
            </p>

            <p className="mt-2 text-lg">
              ${item.product_price}
            </p>

            <div className="mt-auto pt-6 flex flex-col gap-3">
              <button
                onClick={() => handleAddToCart(item)}
                className="border px-6 py-3 uppercase tracking-widest hover:bg-black hover:text-white transition"
              >
                Add to Cart
              </button>

              <button
                onClick={() =>
                  removeFromWishlist(item.product)
                }
                className="text-sm underline text-gray-600 hover:text-black"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

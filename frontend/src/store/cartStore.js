import { create } from "zustand";
import api from "../services/api";
import { useToastStore } from "./toastStore";

const LOCAL_CART_KEY = "guest_cart_v1";
const CART_OWNER_KEY = "cart_owner_v1";
const CART_DIRTY_KEY = "guest_cart_dirty_v1";

const readLocalCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalCart = (items) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
};

const clearLocalCart = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LOCAL_CART_KEY);
  } catch {
    // Ignore storage errors
  }
};

const setOwner = (username) => {
  if (typeof window === "undefined") return;
  if (!username) return;
  try {
    window.localStorage.setItem(CART_OWNER_KEY, username);
  } catch {
    // Ignore storage errors
  }
};

const getOwner = () => {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(CART_OWNER_KEY) || "";
  } catch {
    return "";
  }
};

const setDirty = (value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_DIRTY_KEY, value ? "true" : "false");
  } catch {
    // Ignore storage errors
  }
};

const isDirty = () => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CART_DIRTY_KEY) === "true";
  } catch {
    return false;
  }
};

const markSynced = () => {
  const username = typeof window !== "undefined"
    ? window.localStorage.getItem("username")
    : "";
  setOwner(username);
  setDirty(false);
};

const normalizeCartItems = (items = []) =>
  items.map(item => ({
    cartItemId: item.id,
    id: item.product,
    name: item.product_name,
    price: Number(item.product_price ?? item.unit_price ?? 0),
    image: item.product_image,
    size: item.size || null,
    color: item.color || null,
    quantity: item.quantity,
  }));

const buildPayloadItems = (items = []) =>
  items.map(item => ({
    product_id: item.id,
    quantity: item.quantity,
    size: item.size || "",
    color: item.color || "",
  }));

export const useCartStore = create((set, get) => ({
  cart: [],

  setCart: (items) => {
    set({ cart: items });
    writeLocalCart(items);
  },

  loadCart: async () => {
    const localItems = readLocalCart();
    if (localItems.length) {
      set({ cart: localItems });
    }

    const token = localStorage.getItem("access");
    if (!token) return;
    try {
      const res = await api.get("cart/");
      const normalized = normalizeCartItems(res.data);
      set({ cart: normalized });
      writeLocalCart(normalized);
      markSynced();
    } catch (err) {
      console.error("Failed to load cart", err);
    }
  },

  syncCart: async () => {
    const token = localStorage.getItem("access");
    if (!token) return;
    try {
      const current = get().cart;
      const localItems = current.length ? current : readLocalCart();
      const owner = getOwner();
      const username = localStorage.getItem("username") || "";
      const dirty = isDirty();
      const shouldReplace = dirty || (owner && owner !== username);

      if (!dirty && owner && owner === username) {
        await get().loadCart();
        return;
      }

      if (!localItems.length && !shouldReplace) {
        await get().loadCart();
        return;
      }

      const res = await api.post("cart/sync/", {
        items: buildPayloadItems(localItems),
        replace: shouldReplace,
      });
      const normalized = normalizeCartItems(res.data);
      set({ cart: normalized });
      writeLocalCart(normalized);
      markSynced();
      if (localItems.length || shouldReplace) {
        useToastStore.getState().showToast("Cart merged into your account");
      }
    } catch (err) {
      console.error("Failed to sync cart", err);
    }
  },

  // ADD OR MERGE BY VARIANT
  addToCart: (item) => {
    set((state) => {
      const existing = state.cart.find(
        (i) =>
          i.id === item.id &&
          i.size === item.size &&
          i.color === item.color
      );

      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id &&
            i.size === item.size &&
            i.color === item.color
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }

      return { cart: [...state.cart, item] };
    });
    writeLocalCart(get().cart);

    const token = localStorage.getItem("access");
    if (!token) {
      setDirty(true);
    }
    if (token) {
      api
        .post("cart/add/", {
          product_id: item.id,
          quantity: item.quantity,
          size: item.size || "",
          color: item.color || "",
        })
        .then((res) => {
          const normalized = normalizeCartItems(res.data);
          set({ cart: normalized });
          writeLocalCart(normalized);
          markSynced();
        })
        .catch((err) => {
          console.error("Failed to persist cart item", err);
        });
    }
  },

  // REMOVE ITEM (SAFE)
  removeFromCart: (id, size, color) => {
    const item = get().cart.find(
      (i) => i.id === id && i.size === size && i.color === color
    );

    set((state) => ({
      cart: state.cart.filter(
        (i) =>
          !(
            i.id === id &&
            i.size === size &&
            i.color === color
          )
      ),
    }));
    writeLocalCart(get().cart);

    const token = localStorage.getItem("access");
    if (!token) {
      setDirty(true);
    }
    if (token && item?.cartItemId) {
      api
        .delete(`/cart/item/${item.cartItemId}/remove/`)
        .then((res) => {
          const normalized = normalizeCartItems(res.data);
          set({ cart: normalized });
          writeLocalCart(normalized);
          markSynced();
        })
        .catch((err) => {
          console.error("Failed to remove cart item", err);
        });
    }
  },

  // INCREASE QUANTITY
  increaseQty: (id, size, color) => {
    const item = get().cart.find(
      (i) => i.id === id && i.size === size && i.color === color
    );

    set((state) => ({
      cart: state.cart.map((i) =>
        i.id === id &&
        i.size === size &&
        i.color === color
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ),
    }));
    writeLocalCart(get().cart);

    const token = localStorage.getItem("access");
    if (!token) {
      setDirty(true);
    }
    if (token && item?.cartItemId) {
      api
        .put(`/cart/item/${item.cartItemId}/`, {
          quantity: (item.quantity || 0) + 1,
        })
        .then((res) => {
          const normalized = normalizeCartItems(res.data);
          set({ cart: normalized });
          writeLocalCart(normalized);
          markSynced();
        })
        .catch((err) => {
          console.error("Failed to increase cart quantity", err);
        });
    }
  },

  // DECREASE QUANTITY (MIN 1)
  decreaseQty: (id, size, color) => {
    const item = get().cart.find(
      (i) => i.id === id && i.size === size && i.color === color
    );

    set((state) => ({
      cart: state.cart
        .map((i) =>
          i.id === id &&
          i.size === size &&
          i.color === color
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0),
    }));
    writeLocalCart(get().cart);

    const token = localStorage.getItem("access");
    if (!token) {
      setDirty(true);
    }
    if (token && item?.cartItemId) {
      const nextQty = (item.quantity || 0) - 1;
      api
        .put(`/cart/item/${item.cartItemId}/`, {
          quantity: nextQty,
        })
        .then((res) => {
          const normalized = normalizeCartItems(res.data);
          set({ cart: normalized });
          writeLocalCart(normalized);
          markSynced();
        })
        .catch((err) => {
          console.error("Failed to decrease cart quantity", err);
        });
    }
  },

  clearCart: () => {
    set({ cart: [] });
    clearLocalCart();

    const token = localStorage.getItem("access");
    if (!token) {
      setDirty(true);
      return;
    }
    if (token) {
      api
        .post("/cart/clear/")
        .then((res) => {
          const normalized = normalizeCartItems(res.data);
          set({ cart: normalized });
          writeLocalCart(normalized);
          markSynced();
        })
        .catch((err) => {
          console.error("Failed to clear cart", err);
        });
    }
  },

  // TOTAL COUNT (NAVBAR BADGE)
  cartCount: () =>
    get().cart.reduce((sum, item) => sum + item.quantity, 0),
}));

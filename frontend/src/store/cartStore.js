import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: [],

  // ADD OR MERGE BY VARIANT
  addToCart: (item) =>
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
    }),

  // REMOVE ITEM (SAFE)
  removeFromCart: (id, size, color) =>
    set((state) => ({
      cart: state.cart.filter(
        (i) =>
          !(
            i.id === id &&
            i.size === size &&
            i.color === color
          )
      ),
    })),

  // INCREASE QUANTITY
  increaseQty: (id, size, color) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.id === id &&
        i.size === size &&
        i.color === color
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ),
    })),

  // DECREASE QUANTITY (MIN 1)
  decreaseQty: (id, size, color) =>
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
    })),

  clearCart: () => set({ cart: [] }),

  // TOTAL COUNT (NAVBAR BADGE)
  cartCount: () =>
    get().cart.reduce((sum, item) => sum + item.quantity, 0),
}));

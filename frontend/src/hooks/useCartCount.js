import { useCartStore } from "../store/cartStore";

export default function useCartCount() {
  const items = useCartStore(state => state.items);
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

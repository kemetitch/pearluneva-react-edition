import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useProducts } from "./ProductContext";

const CartContext = createContext();

const CART_KEY = "artisan_cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const { products, getProduct, loading: productsLoading } = useProducts();

  const syncCart = useCallback(() => {
    if (productsLoading || products.length === 0) return;
    setCart((prev) => {
      // Filter out items that are not in the products list
      const valid = prev.filter((item) =>
        products.some((p) => String(p.id) === String(item.id)),
      );
      if (valid.length !== prev.length) {
        console.log("Cart synced: removed non-existent products.");
        return valid;
      }
      return prev;
    });
  }, [products, productsLoading]);

  useEffect(() => {
    // Only sync if products have loaded and we have data
    if (!productsLoading && products.length > 0) {
      syncCart();
    }
  }, [productsLoading, products.length, syncCart]);

  const addToCart = useCallback((productId, quantity = 1) => {
    console.log(`Adding to cart: ${productId} x${quantity}`);
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => String(item.id) === String(productId),
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { id: productId, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((productId, action) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => String(item.id) === String(productId),
      );
      if (idx === -1) return prev;

      const updated = [...prev];
      if (action === "increase") {
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
      } else if (action === "decrease") {
        if (updated[idx].quantity <= 1) {
          updated.splice(idx, 1);
        } else {
          updated[idx] = {
            ...updated[idx],
            quantity: updated[idx].quantity - 1,
          };
        }
      }
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) =>
      prev.filter((item) => String(item.id) !== String(productId)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        syncCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

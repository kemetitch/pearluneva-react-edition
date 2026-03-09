import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { fetchProducts as apiFetchProducts } from "../lib/products";
import QuickView from "../components/product/QuickView";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetchProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const getProduct = useCallback(
    (id) => {
      return products.find((p) => String(p.id) === String(id));
    },
    [products],
  );

  const openQuickView = useCallback(
    (product) => setQuickViewProduct(product),
    [],
  );
  const closeQuickView = useCallback(() => setQuickViewProduct(null), []);

  const getFeatured = useCallback(() => {
    return products.filter((p) => p.badge);
  }, [products]);

  const getByCategory = useCallback(
    (category) => {
      if (category === "all") return products;
      return products.filter((p) => p.category === category);
    },
    [products],
  );

  const getRelated = useCallback(
    (productId, category, limit = 4) => {
      let related = products.filter(
        (p) => p.category === category && String(p.id) !== String(productId),
      );
      if (related.length < limit) {
        const others = products.filter(
          (p) => String(p.id) !== String(productId) && p.category !== category,
        );
        related = [...related, ...others].slice(0, limit);
      }
      return related.slice(0, limit);
    },
    [products],
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        loadProducts,
        getProduct,
        getFeatured,
        getByCategory,
        getRelated,
        quickViewProduct,
        openQuickView,
        closeQuickView,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProducts must be used within ProductProvider");
  return context;
}

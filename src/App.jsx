import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ProductProvider, useProducts } from "./context/ProductContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import QuickView from "./components/product/QuickView";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

/** Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Public layout with Navbar + Footer */
function PublicLayout() {
  const { quickViewProduct, closeQuickView } = useProducts();
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <QuickView product={quickViewProduct} onClose={closeQuickView} />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ProductProvider>
        <CartProvider>
          <ToastProvider>
            <ScrollToTop />
            <Routes>
              {/* Public routes with shared layout */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* Admin routes (no shared Navbar/Footer) */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            </Routes>
          </ToastProvider>
        </CartProvider>
      </ProductProvider>
    </Router>
  );
}

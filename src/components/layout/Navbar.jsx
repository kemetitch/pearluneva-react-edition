import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartDrawer from "../cart/CartDrawer";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`} id="navbar">
        <div className="container">
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-icon">✦</span>
            Pearluneva
          </Link>

          <ul
            className={`navbar__links${menuOpen ? " open" : ""}`}
            id="nav-links"
          >
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `navbar__link${isActive ? " active" : ""}`
                }
                onClick={closeMenu}
                end
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `navbar__link${isActive ? " active" : ""}`
                }
                onClick={closeMenu}
              >
                Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `navbar__link${isActive ? " active" : ""}`
                }
                onClick={closeMenu}
              >
                Cart
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `navbar__link${isActive ? " active" : ""}`
                }
                onClick={closeMenu}
              >
                Contact
              </NavLink>
            </li>
          </ul>

          <div className="navbar__actions">
            <button
              className="navbar__cart"
              id="cart-icon"
              aria-label="Shopping cart"
              onClick={(e) => {
                e.preventDefault();
                setDrawerOpen(true);
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="navbar__cart-count" id="cart-count">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className={`navbar__toggle${menuOpen ? " active" : ""}`}
              id="nav-toggle"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="mobile-overlay show"
          id="mobile-overlay"
          onClick={closeMenu}
        ></div>
      )}

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

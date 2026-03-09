import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useToast } from "../context/ToastContext";
import CheckoutModal from "../components/cart/CheckoutModal";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { getProduct } = useProducts();
  const { showToast } = useToast();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  let subtotal = 0;
  const items = cart
    .map((item) => {
      const product = getProduct(item.id);
      if (!product) return null;
      const total = product.price * item.quantity;
      subtotal += total;
      return { ...item, product, total };
    })
    .filter(Boolean);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Shopping Cart</h1>
          <div className="section-divider"></div>
          <nav className="page-header__breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Cart</span>
          </nav>
        </div>
      </section>

      {/* Cart Section */}
      <section className="section cart-section">
        <div className="container" id="cart-container">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty__icon">🛒</div>
              <h2 className="cart-empty__title">Your Cart is Empty</h2>
              <p className="cart-empty__text">
                Looks like you haven't added any handmade treasures yet.
              </p>
              <Link to="/products" className="btn btn--primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="cart__layout">
              <div>
                <h2 className="font-heading fs-xl mb-xl">
                  Shopping Cart ({totalItems} items)
                </h2>
                <div className="cart__items" id="cart-items">
                  {items.map(({ id, quantity, product }) => (
                    <div className="cart-item" key={id} data-product-id={id}>
                      <div className="cart-item__image">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                        />
                      </div>
                      <div className="cart-main__info">
                        <div className="cart-item__info">
                          <h3 className="cart-item__name">{product.name}</h3>
                          <span className="cart-item__price">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="cart-item__quantity">
                          <button
                            className="cart-item__qty-btn"
                            onClick={() => updateQuantity(id, "decrease")}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="cart-item__qty-value">
                            {quantity}
                          </span>
                          <button
                            className="cart-item__qty-btn"
                            onClick={() => updateQuantity(id, "increase")}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="cart-item__remove"
                          aria-label="Remove item"
                          onClick={() => {
                            removeFromCart(id);
                            showToast(
                              `${product.name} removed from cart`,
                              "🗑️",
                            );
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="cart__summary">
                <h3 className="cart__summary-title">Order Summary</h3>
                <div className="cart__summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="cart__summary-row fs-xs clr-muted">
                  <span>Shipping will be confirmed after order</span>
                </div>
                <div className="cart__summary-total">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="cart__summary-actions">
                  <button
                    className="btn btn--whatsapp"
                    onClick={() => setCheckoutOpen(true)}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Order via WhatsApp
                  </button>
                  <Link
                    to="/products"
                    className="btn btn--secondary text-center"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}

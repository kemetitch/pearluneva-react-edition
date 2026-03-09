import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";

export default function CartDrawer({ open, onClose }) {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { getProduct } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

  return (
    <div className={`cart-drawer${open ? " open" : ""}`} id="cart-drawer">
      <div
        className="cart-drawer__overlay"
        id="cart-drawer-overlay"
        onClick={onClose}
      ></div>
      <div className="cart-drawer__content">
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Your Cart</h2>
          <button
            className="cart-drawer__close"
            id="cart-drawer-close"
            aria-label="Close cart"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="cart-drawer__body" id="cart-drawer-items">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <p>Your cart is empty.</p>
              <button
                className="footer__link"
                onClick={() => {
                  onClose();
                  navigate("/products");
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map(({ id, quantity, product }) => (
              <div className="cart-drawer__item" key={id}>
                <div className="cart-drawer__item-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="cart-drawer__item-info">
                  <h4 className="cart-drawer__item-name">{product.name}</h4>
                  <div className="cart-drawer__item-price">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="cart-drawer__item-qty-row">
                    <div className="cart-drawer__qty-controls">
                      <button
                        className="cart-drawer__item-qty-btn"
                        onClick={() => updateQuantity(id, "decrease")}
                      >
                        −
                      </button>
                      <span className="cart-drawer__qty-value">{quantity}</span>
                      <button
                        className="cart-drawer__item-qty-btn"
                        onClick={() => updateQuantity(id, "increase")}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="cart-drawer__item-remove"
                      onClick={() => removeFromCart(id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-drawer__footer">
          <div className="cart-drawer__total-row">
            <span>Total</span>
            <span id="cart-drawer-total-value">${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-drawer__actions">
            <button className="btn btn--secondary btn--full" onClick={onClose}>
              Continue Shopping
            </button>
            <button
              className="btn btn--primary btn--full"
              onClick={() => {
                onClose();
                navigate("/cart");
              }}
            >
              Go to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

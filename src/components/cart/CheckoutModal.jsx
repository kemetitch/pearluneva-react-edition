import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import { useToast } from "../../context/ToastContext";

export default function CheckoutModal({ open, onClose }) {
  const { cart, clearCart } = useCart();
  const { getProduct } = useProducts();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  if (!open) return null;

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

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = true;
    if (!form.phone.trim() || !/^[0-9+\-\s()]+$/.test(form.phone.trim()))
      errs.phone = true;
    if (!form.address.trim()) errs.address = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      showToast("Please fill in all required fields", "⚠️");
      return;
    }
    if (items.length === 0) {
      showToast("Your cart is empty!", "⚠️");
      return;
    }

    // Build WhatsApp message
    const enc = encodeURIComponent;
    const NL = "%0A";
    const SP = "%20";

    let msg = enc("*New Order from Pearluneva*") + NL + NL;
    msg += enc("Name: " + form.name) + NL;
    msg += enc("Phone: " + form.phone) + NL;
    msg += enc("Address: " + form.address) + NL + NL;
    msg += enc("*Order Details:*") + NL;

    items.forEach(({ quantity, product, total }) => {
      msg += enc(`- ${product.name} x${quantity} = $${total.toFixed(2)}`) + NL;
    });

    msg += NL + enc(`*Total: $${subtotal.toFixed(2)}*`) + NL;
    if (form.notes) msg += enc("Notes: " + form.notes) + NL;
    msg += NL + enc("Shipping will be confirmed after order.");

    window.open(`https://wa.me/2001008925664?text=${msg}`, "_blank");

    clearCart();
    onClose();
    showToast("Order sent to WhatsApp! Cart cleared.", "✅");
    setForm({ name: "", phone: "", address: "", notes: "" });
  };

  return (
    <div className={`checkout-modal${open ? " open" : ""}`} id="checkout-modal">
      <div className="checkout-modal__overlay" onClick={onClose}></div>
      <div className="checkout-modal__container">
        <div className="checkout-modal__header">
          <h2 className="checkout-modal__title">
            <span>📋</span> Checkout
          </h2>
          <button
            className="checkout-modal__close"
            aria-label="Close checkout"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="checkout-modal__body">
          <div className="checkout-form__section">
            <h3 className="checkout-form__section-title">
              <span>👤</span> Customer Information
            </h3>

            <div className="form-group">
              <label htmlFor="checkout-name">
                Full Name <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="checkout-name"
                className={errors.name ? "error" : ""}
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }));
                  setErrors((er) => ({ ...er, name: false }));
                }}
              />
              {errors.name && (
                <div className="form-error-msg show">
                  ⚠ Please enter your full name
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="checkout-phone">
                Phone Number <span className="required-star">*</span>
              </label>
              <input
                type="tel"
                id="checkout-phone"
                className={errors.phone ? "error" : ""}
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={(e) => {
                  setForm((f) => ({ ...f, phone: e.target.value }));
                  setErrors((er) => ({ ...er, phone: false }));
                }}
              />
              {errors.phone && (
                <div className="form-error-msg show">
                  ⚠ Please enter a valid phone number
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="checkout-address">
                Address <span className="required-star">*</span>
              </label>
              <textarea
                id="checkout-address"
                className={errors.address ? "error" : ""}
                placeholder="Enter your full delivery address"
                rows="2"
                value={form.address}
                onChange={(e) => {
                  setForm((f) => ({ ...f, address: e.target.value }));
                  setErrors((er) => ({ ...er, address: false }));
                }}
              ></textarea>
              {errors.address && (
                <div className="form-error-msg show">
                  ⚠ Please enter your delivery address
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="checkout-notes">
                Additional Notes{" "}
                <span className="clr-muted fw-regular">(optional)</span>
              </label>
              <textarea
                id="checkout-notes"
                placeholder="Any special instructions..."
                rows="2"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
              ></textarea>
            </div>
          </div>

          <div className="checkout-form__section">
            <h3 className="checkout-form__section-title">
              <span>🛒</span> Order Summary
            </h3>
            <div className="checkout-summary">
              {items.map(({ id, quantity, product, total }) => (
                <div className="checkout-summary__item" key={id}>
                  <div className="checkout-summary__item-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="checkout-summary__item-name">
                      {product.name}
                    </div>
                    <div className="checkout-summary__item-qty">
                      Qty: {quantity} × ${product.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="checkout-summary__item-price">
                    ${total.toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="checkout-summary__divider"></div>
              <div className="checkout-summary__row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout-summary__row fs-xs clr-muted">
                <span>Shipping will be confirmed after order</span>
              </div>
              <div className="checkout-summary__total">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-modal__footer">
          <button
            className="btn btn--whatsapp"
            type="button"
            onClick={handleSubmit}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Confirm Order on WhatsApp
          </button>
          <button className="btn btn--secondary text-center" onClick={onClose}>
            ← Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

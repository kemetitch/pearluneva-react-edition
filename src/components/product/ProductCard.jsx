import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import { useToast } from "../../context/ToastContext";
import AnimateOnScroll from "../ui/AnimateOnScroll";

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { openQuickView } = useProducts();
  const { showToast } = useToast();

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product.id, quantity);
    showToast(`${product.name} (x${quantity}) added to cart!`, "🛒");
    setQuantity(1);
  };

  return (
    <AnimateOnScroll className="product-card" data-category={product.category}>
      <div className="product-card__image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
        />
        {product.badge && (
          <span className="product-card__badge">{product.badge}</span>
        )}
        <div className="product-card__quick-view">
          <button
            onClick={() => openQuickView(product)}
            className="btn btn--primary btn--sm product-card__quick-view-btn"
          >
            <span>🔍</span> Quick View
          </button>
        </div>
      </div>
      <div className="product-card__info">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__price">${product.price.toFixed(2)}</div>

        <div className="product-card__qty-selector">
          <button
            className="qty-btn"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            min="1"
            className="qty-input"
            readOnly
          />
          <button className="qty-btn" onClick={() => setQuantity((q) => q + 1)}>
            +
          </button>
        </div>

        <div className="product-card__actions">
          <button
            className="btn btn--primary btn--sm product-card__add-to-cart"
            onClick={handleAdd}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Add to Cart
          </button>
          <Link
            to={`/product/${product.id}`}
            className="btn btn--secondary btn--sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </AnimateOnScroll>
  );
}

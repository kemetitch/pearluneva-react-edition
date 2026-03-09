import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

export default function QuickView({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  if (!product) return null;

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    showToast(`${product.name} (x${quantity}) added to cart!`, "🛒");
    onClose();
  };

  const handleViewDetails = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="modal open" id="quick-view-modal">
      <div className="modal__overlay" onClick={onClose}></div>
      <div className="modal__container">
        <button className="modal__close" onClick={onClose}>
          ✕
        </button>
        <div className="modal__content">
          <div className="quick-view">
            <div className="quick-view__image">
              <img
                src={productImages[activeImageIndex]}
                alt={product.name}
                id="qv-main-image"
              />
              {productImages.length > 1 && (
                <div className="carousel-thumbs carousel-thumbs--qv">
                  {productImages.map((src, i) => (
                    <button
                      key={i}
                      className={`carousel-thumb${i === activeImageIndex ? " active" : ""}`}
                      onClick={() => setActiveImageIndex(i)}
                    >
                      <img src={src} alt={`${product.name} view ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="quick-view__info">
              <span className="product-card__category">{product.category}</span>
              <h2 className="quick-view__title">{product.name}</h2>
              <div className="quick-view__price">
                ${product.price.toFixed(2)}
              </div>
              <p className="quick-view__description">{product.description}</p>

              <div className="quick-view__actions">
                <div className="quantity-selector">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={() => setQuantity((q) => q + 1)}>+</button>
                </div>
                <button
                  className="btn btn--primary btn--full"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button
                  className="btn btn--secondary btn--full"
                  onClick={handleViewDetails}
                >
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import ProductGrid from "../components/product/ProductGrid";
import AnimateOnScroll from "../components/ui/AnimateOnScroll";

// Fancybox imports
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { getProduct, getRelated, loading } = useProducts();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = getProduct(id);

  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
      // Custom options
      Carousel: {
        infinite: false,
      },
    });

    return () => {
      Fancybox.destroy();
    };
  }, []);

  if (loading) {
    return (
      <section className="section pt-96">
        <div className="container text-center py-5rem">Loading...</div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="section pt-96">
        <div className="container">
          <div className="cart-empty grid-col-all">
            <div className="cart-empty__icon">🔍</div>
            <h2 className="cart-empty__title">Product Not Found</h2>
            <p className="cart-empty__text">
              The product you're looking for doesn't exist.
            </p>
            <Link to="/products" className="btn btn--primary">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  const related = getRelated(product.id, product.category);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    showToast(`${product.name} added to cart!`, "🛒");
  };

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Product Details</h1>
          <div className="section-divider"></div>
          <nav className="page-header__breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/products">Products</Link>
            <span>/</span>
            <span>Details</span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="section product-detail">
        <div className="container">
          <div className="product-detail__container">
            <div className="product-detail__gallery">
              <div className="product-detail__main-image">
                <a
                  href={productImages[activeImageIndex]}
                  className="carousel-main-link"
                  data-fancybox="product-gallery"
                  data-caption={`${product.name} - View ${activeImageIndex + 1}`}
                >
                  <img
                    src={productImages[activeImageIndex]}
                    alt={product.name}
                    id="detail-main-image"
                  />
                  <span className="carousel-zoom-hint">🔍 View Gallery</span>
                </a>

                {/* Hidden links for other gallery images to enable side-to-side navigation in Fancybox */}
                {productImages.map(
                  (src, i) =>
                    i !== activeImageIndex && (
                      <a
                        key={`hidden-${i}`}
                        href={src}
                        data-fancybox="product-gallery"
                        data-caption={`${product.name} - View ${i + 1}`}
                        className="hidden"
                      />
                    ),
                )}
              </div>
              {productImages.length > 1 && (
                <div className="carousel-thumbs">
                  {productImages.map((src, i) => (
                    <button
                      key={i}
                      className={`carousel-thumb${i === activeImageIndex ? " active" : ""}`}
                      onClick={() => setActiveImageIndex(i)}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img
                        src={src}
                        alt={`${product.name} view ${i + 1}`}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="product-detail__info">
              <span className="product-detail__category">
                {product.category}
              </span>
              <h1 className="product-detail__name">{product.name}</h1>
              <div className="product-detail__price">
                ${product.price.toFixed(2)}
              </div>
              <div className="product-detail__description">
                <p>{product.description}</p>
              </div>

              <div className="quantity-selector">
                <span className="quantity-selector__label">Quantity</span>
                <div className="quantity-selector__controls">
                  <button
                    className="quantity-selector__btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className="quantity-selector__input"
                    value={quantity}
                    min="1"
                    max="99"
                    aria-label="Quantity"
                    readOnly
                  />
                  <button
                    className="quantity-selector__btn"
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="product-detail__actions">
                <button className="btn btn--primary" onClick={handleAddToCart}>
                  <svg
                    width="20"
                    height="20"
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
                <Link to="/products" className="btn btn--secondary">
                  ← Back to Shop
                </Link>
              </div>

              {/* <div className="product-detail__features">
                <div className="feature-item">
                  <div className="feature-item__icon">🌿</div>
                  <div className="feature-item__text">Eco-Friendly</div>
                </div>
                <div className="feature-item">
                  <div className="feature-item__icon">✋</div>
                  <div className="feature-item__text">Handmade</div>
                </div>
                <div className="feature-item">
                  <div className="feature-item__icon">💎</div>
                  <div className="feature-item__text">Premium Quality</div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section bg-alt">
          <div className="container">
            <AnimateOnScroll as="h2" className="section-title">
              You May Also Like
            </AnimateOnScroll>
            <AnimateOnScroll className="section-divider" />
            <AnimateOnScroll as="p" className="section-subtitle">
              Browse more handcrafted pieces from our collection.
            </AnimateOnScroll>
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </>
  );
}

import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductGrid from "../components/product/ProductGrid";
import AnimateOnScroll from "../components/ui/AnimateOnScroll";

export default function HomePage() {
  const { getFeatured, loading } = useProducts();
  const featured = getFeatured();

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="hero" id="hero">
        <div className="hero__bg">
          <img
            src="/images/hero-banner.png"
            alt="Pearluneva handmade products collection"
            loading="eager"
          />
        </div>
        <div className="hero__content">
          <span className="hero__badge">✦ Handcrafted With Love</span>
          <h1 className="hero__title">
            Discover the Art of <span>Handmade</span>
          </h1>
          <p className="hero__description">
            Uniquely crafted candles, bags, and concrete pieces — each one tells
            a story. Bring warmth and artisan elegance into your everyday life.
          </p>
          <div className="hero__buttons">
            <Link to="/products" className="btn btn--accent">
              Shop Now →
            </Link>
            <a href="#categories" className="btn hero__btn-secondary">
              Explore Categories
            </a>
          </div>
        </div>
        <div className="hero__scroll">
          <span>Scroll</span>
          <div className="hero__scroll-line"></div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="section categories" id="categories">
        <div className="container">
          <AnimateOnScroll as="h2" className="section-title">
            Our Collections
          </AnimateOnScroll>
          <AnimateOnScroll className="section-divider" />
          <AnimateOnScroll as="p" className="section-subtitle">
            Three unique collections, each crafted by hand with natural
            materials and endless passion.
          </AnimateOnScroll>

          <div className="categories__grid stagger-children">
            <AnimateOnScroll>
              <Link to="/products?cat=candles" className="category-card">
                <img
                  src="/images/candle-1.png"
                  alt="Handmade Candles"
                  className="category-card__image"
                  loading="lazy"
                />
                <div className="category-card__overlay">
                  <h3 className="category-card__title">Candles</h3>
                  <span className="category-card__count">4 Products</span>
                </div>
                <div className="category-card__arrow">→</div>
              </Link>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <Link to="/products?cat=bags" className="category-card">
                <img
                  src="/images/bag-1.png"
                  alt="Handmade Beaded Bags"
                  className="category-card__image"
                  loading="lazy"
                />
                <div className="category-card__overlay">
                  <h3 className="category-card__title">Beaded Bags</h3>
                  <span className="category-card__count">3 Products</span>
                </div>
                <div className="category-card__arrow">→</div>
              </Link>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <Link to="/products?cat=concrete" className="category-card">
                <img
                  src="/images/concrete-1.png"
                  alt="Handmade Concrete"
                  className="category-card__image"
                  loading="lazy"
                />
                <div className="category-card__overlay">
                  <h3 className="category-card__title">Concrete</h3>
                  <span className="category-card__count">3 Products</span>
                </div>
                <div className="category-card__arrow">→</div>
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS SECTION ===== */}
      <section className="section featured" id="featured">
        <div className="container">
          <AnimateOnScroll as="h2" className="section-title">
            Featured Products
          </AnimateOnScroll>
          <AnimateOnScroll className="section-divider" />
          <AnimateOnScroll as="p" className="section-subtitle">
            Handpicked favorites from our collection — loved by our community.
          </AnimateOnScroll>

          {loading ? (
            <div className="text-center py-3rem">Loading products...</div>
          ) : (
            <ProductGrid products={featured} />
          )}

          <AnimateOnScroll className="text-center mt-3xl">
            <Link to="/products" className="btn btn--primary">
              View All Products →
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="section cta-section">
        <div className="container">
          <AnimateOnScroll as="h2" className="section-title">
            Every Piece Tells a Story
          </AnimateOnScroll>
          <AnimateOnScroll className="section-divider" />
          <AnimateOnScroll as="p" className="section-subtitle">
            Support handmade. Support artisans. Bring one-of-a-kind beauty into
            your space.
          </AnimateOnScroll>
          <AnimateOnScroll className="text-center">
            <Link to="/products" className="btn btn--accent btn--xl">
              Shop Now →
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}

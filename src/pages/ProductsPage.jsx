import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductGrid from "../components/product/ProductGrid";
import AnimateOnScroll from "../components/ui/AnimateOnScroll";

const CATEGORIES = [
  { key: "all", label: "All Products" },
  { key: "candles", label: "🕯️ Candles" },
  { key: "bags", label: "👜 Beaded Bags" },
  { key: "concrete", label: "🏺 Concrete" },
];

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const { getByCategory, loading } = useProducts();

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filtered = getByCategory(activeCategory);

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Our Products</h1>
          <div className="section-divider"></div>
          <nav className="page-header__breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Products</span>
          </nav>
        </div>
      </section>

      {/* Products Section */}
      <section className="section">
        <div className="container">
          <div className="filters" id="filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`filter-btn${activeCategory === cat.key ? " active" : ""}`}
                data-category={cat.key}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-3rem">Loading products...</div>
          ) : (
            <ProductGrid products={filtered} className="products__grid" />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <AnimateOnScroll as="h2" className="section-title">
            Can't Find What You're Looking For?
          </AnimateOnScroll>
          <AnimateOnScroll className="section-divider" />
          <AnimateOnScroll as="p" className="section-subtitle">
            We also accept custom orders! Reach out to us and let's create
            something special together.
          </AnimateOnScroll>
          <AnimateOnScroll className="text-center">
            <Link to="/contact" className="btn btn--accent btn--xl">
              Contact Us →
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}

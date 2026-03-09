import ProductCard from "./ProductCard";

export default function ProductGrid({ products, className = "" }) {
  if (!products || products.length === 0) return null;

  return (
    <div className={`featured__grid stagger-children ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

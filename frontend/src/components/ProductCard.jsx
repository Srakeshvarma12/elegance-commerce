export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="rounded-[1.8rem] overflow-hidden group cursor-pointer bg-white/90 border border-black/10 shadow-[var(--shadow-soft-tight)] transition-transform duration-500 hover:-translate-y-2">

      {/* Image */}
      <div className="h-[320px] bg-black/5 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
      </div>

      {/* Info */}
      <div className="pt-5 pb-6 px-5">
        <p className="text-xs text-muted uppercase tracking-[0.3em]">
          {product.category || "Collection"}
        </p>

        <h3 className="font-display text-xl mt-2">
          {product.name}
        </h3>

        <p className="mt-2 text-xs tracking-[0.28em] uppercase text-muted">
          INR {product.price}
        </p>
      </div>

    </div>
  );
}

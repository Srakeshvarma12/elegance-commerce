export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="card group flex flex-col h-full">
      {/* Image */}
      <div className="aspect-square bg-bg-subtle flex items-center justify-center p-6 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1.5">
          {product.category || "Product"}
        </p>
        <h3 className="text-[0.95rem] font-semibold tracking-tight text-text-primary leading-snug mb-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-base font-bold text-text-primary">${product.price}</span>
          <div className="w-8 h-8 rounded-full bg-text-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

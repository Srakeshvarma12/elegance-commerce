export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="rounded-2xl overflow-hidden group cursor-pointer">

      {/* Image */}
      <div className="h-[320px] bg-gray-200 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* Info */}
      <div className="pt-4">
        <p className="text-sm text-gray-500 uppercase tracking-wide">
          {product.category || "Collection"}
        </p>

        <h3 className="font-serif text-xl mt-1">
          {product.name}
        </h3>

        <p className="mt-1 font-medium">
          ${product.price}
        </p>
      </div>

    </div>
  );
}
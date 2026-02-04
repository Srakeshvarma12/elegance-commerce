import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // READ QUERY PARAMS
  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";
  const category = params.get("category") || "";

  // FETCH PRODUCTS (WITH FILTERS)
  useEffect(() => {
    setLoading(true);

let url = "https://elegance-commerce.onrender.com/api/products/?";

if (search) url += `search=${encodeURIComponent(search)}&`;
if (category && category !== "all") url += `category=${category}`;

      url += `category=${encodeURIComponent(category)}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, category]);

  if (loading) {
    return <div className="py-40 text-center">Loading products...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      {products.length === 0 && (
        <p className="text-center text-gray-500 mb-10">
          No products found.
        </p>
      )}


      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="block text-center"
          >
            <div className="w-full aspect-square overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition"
              />
            </div>

            <h3 className="font-serif text-lg mt-4 uppercase">
              {product.name}
            </h3>
            <p className="text-gray-600 mt-1">${product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

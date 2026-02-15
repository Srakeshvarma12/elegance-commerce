import { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);
  const controllerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";
  const category = params.get("category") || "";

  // RESET WHEN FILTER CHANGES
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [search, category]);

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (controllerRef.current) {
          controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        setLoading(true);

        let url = `https://elegance-commerce.onrender.com/api/products/?page=${page}`;

        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (category && category !== "all") {
          url += `&category=${encodeURIComponent(category)}`;
        }

        const res = await fetch(url, {
          signal: controllerRef.current.signal,
        });

        const data = await res.json();

        setProducts(prev => [...prev, ...(data.results || [])]);
        setHasMore(!!data.next);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [page, search, category]);

  // INTERSECTION OBSERVER (AUTO LOAD)
  useEffect(() => {
    if (loading) return;
    if (!hasMore) return;

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loading, hasMore]);

  // INITIAL LOADER
  if (loading && products.length === 0) {
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
        {products.map(product => (
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

            <p className="text-gray-600 mt-1">
              ${product.price}
            </p>
          </Link>
        ))}
      </div>

      {/* OBSERVER TARGET */}
      <div ref={loadMoreRef} className="h-16 flex items-center justify-center">
        {loading && <span className="text-gray-500">Loading more...</span>}
        {!hasMore && <span className="text-gray-400">No more products</span>}
      </div>

    </div>
  );
}

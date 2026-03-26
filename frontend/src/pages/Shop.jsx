import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import api from "../services/api";
import { useUserStore } from "../store/userStore";
import ProductCard from "../components/ProductCard";

const CATEGORY_OPTIONS = [
  "all",
  "clothing",
  "watches",
  "footwear",
  "electronics",
  "sunglasses",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "name", label: "Name A-Z" },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");

  const observerRef = useRef(null);
  const controllerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const search = params.get("search") || "";
  const category = params.get("category") || "all";
  const sort = params.get("sort") || "newest";
  const min = params.get("min") || "";
  const max = params.get("max") || "";

  const [filters, setFilters] = useState({
    search,
    category,
    sort,
    min,
    max,
  });

  useEffect(() => {
    setFilters({ search, category, sort, min, max });
  }, [search, category, sort, min, max]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [search, category]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (controllerRef.current) {
          controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        setLoading(true);
        setError("");

        const params = { page };
        if (search) params.search = search;
        if (category && category !== "all") params.category = category;
        if (sort) params.sort = sort;
        if (min) params.min = min;
        if (max) params.max = max;

        const res = await api.get("products/", {
          params,
          signal: controllerRef.current.signal,
        });

        const data = res.data;
        const results = Array.isArray(data) ? data : data.results || [];

        setProducts(prev => (page === 1 ? results : [...prev, ...results]));
        setHasMore(Boolean(data.next));
      } catch (err) {
        const isCanceled =
          err?.name === "AbortError" ||
          err?.name === "CanceledError" ||
          err?.code === "ERR_CANCELED";
        if (!isCanceled) {
          console.error("Fetch error:", err);
          setError("Unable to load products right now.");
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
  }, [page, search, category, sort, min, max]);

  const visibleProducts = useMemo(() => {
    return products;
  }, [products]);

  const applyFilters = next => {
    const nextParams = new URLSearchParams();
    if (next.search) nextParams.set("search", next.search);
    if (next.category && next.category !== "all") {
      nextParams.set("category", next.category);
    }
    if (next.sort) nextParams.set("sort", next.sort);
    if (next.min) nextParams.set("min", next.min);
    if (next.max) nextParams.set("max", next.max);

    const query = nextParams.toString();
    navigate(query ? `/shop?${query}` : "/shop");
  };

  const handleSubmit = e => {
    e.preventDefault();
    applyFilters(filters);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      sort: "newest",
      min: "",
      max: "",
    });
    navigate("/shop");
  };

  const isInitialLoading = loading && products.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted mb-4 opacity-70">Shop</p>
          <h1 className="text-4xl md:text-5xl font-display mb-4">Curated Essentials</h1>
          <p className="text-muted max-w-xl text-sm leading-relaxed">
            Refined pieces, thoughtfully composed. Use the filters to craft your personal edit.
          </p>
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted font-medium">
          {visibleProducts.length} items
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 items-start">
        {/* Filters */}
        <aside className="sticky top-28 bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-black/5 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <p className="text-[10px] uppercase tracking-[0.4em] font-semibold text-ink/40 border-b border-black/5 pb-4">
              Refine By
            </p>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted mb-3">Search</label>
              <input
                type="text"
                placeholder="Keywords..."
                className="w-full bg-black/5 border-none px-4 py-3 rounded-xl text-sm focus:ring-1 ring-ink/20 outline-none transition"
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted mb-3">Category</label>
              <select
                value={filters.category}
                onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-black/5 border-none px-4 py-3 rounded-xl text-sm focus:ring-1 ring-ink/20 outline-none transition appearance-none cursor-pointer"
              >
                {CATEGORY_OPTIONS.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted mb-3">Price Range</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.min}
                  onChange={e => setFilters(prev => ({ ...prev, min: e.target.value }))}
                  className="w-full bg-black/5 border-none px-4 py-3 rounded-xl text-sm outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.max}
                  onChange={e => setFilters(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full bg-black/5 border-none px-4 py-3 rounded-xl text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted mb-3">Sort By</label>
              <select
                value={filters.sort}
                onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                className="w-full bg-black/5 border-none px-4 py-3 rounded-xl text-sm outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button type="submit" className="btn-elegant w-full text-[10px] py-4">
                Apply Filters
              </button>
              <button type="button" onClick={clearFilters} className="text-[10px] uppercase tracking-widest text-muted hover:text-ink transition py-2">
                Clear All
              </button>
            </div>
          </form>
        </aside>

        {/* Products */}
        <section>
          {isInitialLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-[320px] bg-black/5 rounded-[1.8rem]" />
                  <div className="h-4 bg-black/5 mt-6 w-1/3 rounded-full" />
                  <div className="h-6 bg-black/5 mt-3 w-2/3 rounded-full" />
                </div>
              ))}
            </div>
          )}

          {!isInitialLoading && error && (
            <div className="text-center py-20 bg-white/30 rounded-3xl border border-dashed border-black/10">
              <p className="text-muted text-sm">{error}</p>
            </div>
          )}

          {!isInitialLoading && !error && visibleProducts.length === 0 && (
            <div className="text-center py-20 bg-white/30 rounded-3xl border border-dashed border-black/10">
              <p className="text-muted text-sm">No products match your criteria.</p>
            </div>
          )}

          {!isInitialLoading && !error && visibleProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {visibleProducts.map(product => (
                <Link key={product.id} to={`/product/${product.id}`} className="block">
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
          )}

          <div ref={loadMoreRef} className="mt-16 text-center">
            {loading && <p className="text-[10px] uppercase tracking-widest text-muted animate-pulse">Gathering more pieces...</p>}
            {!hasMore && !loading && visibleProducts.length > 0 && (
              <p className="text-[10px] uppercase tracking-widest text-muted opacity-40">— End of Collection —</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

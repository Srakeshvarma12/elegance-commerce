import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchProducts as getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

const CATEGORY_OPTIONS = [
  "all",
  "Audio",
  "Wearables",
  "TV & Video",
  "Accessories",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Latest" },
  { value: "price_low", label: "Price: Low → High" },
  { value: "price_high", label: "Price: High → Low" },
  { value: "name", label: "Name A–Z" },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");

  const loadMoreRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const search = params.get("search") || "";
  const category = params.get("category") || "all";
  const sort = params.get("sort") || "newest";

  const [filters, setFilters] = useState({ search, category, sort });

  useEffect(() => {
    setFilters({ search, category, sort });
  }, [search, category, sort]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [search, category]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const filterParams = { page };
        if (search) filterParams.search = search;
        if (category && category !== "all") filterParams.category = category;
        if (sort) filterParams.sort = sort;

        const data = await getProducts(filterParams);
        const results = Array.isArray(data) ? data : data.results || [];

        setProducts(prev => (page === 1 ? results : [...prev, ...results]));
        setHasMore(Boolean(data.next));
      } catch (err) {
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [page, search, category, sort]);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="section-container pt-12 pb-8 md:pt-16 md:pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <p className="label mb-2">Collection</p>
            <h1 className="heading-xl">Shop</h1>
          </div>
          <p className="text-sm text-text-muted font-medium">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </header>

      <div className="section-container pb-20 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 items-start">
        {/* Filters */}
        <aside className="card-elevated sticky top-[88px] p-6 flex flex-col gap-8">
          <div>
            <h3 className="form-label mb-4">Category</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => navigate(`/shop?category=${opt}&sort=${sort}`)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    category === opt
                      ? "bg-text-primary text-white shadow-sm"
                      : "bg-bg-subtle text-text-secondary hover:bg-border-strong"
                  }`}
                >
                  {opt === "all" ? "All" : opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="form-label mb-3">Sort by</h3>
            <select
              value={sort}
              onChange={e => navigate(`/shop?category=${category}&sort=${e.target.value}`)}
              className="input !py-2.5 !text-sm cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <button
            onClick={() => navigate("/shop")}
            className="text-xs font-medium text-text-muted hover:text-text-primary transition-colors flex items-center gap-1.5 mt-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8m0-5v5h5"/></svg>
            Reset filters
          </button>
        </aside>

        {/* Product Grid */}
        <section>
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card h-[420px] animate-pulse bg-bg-subtle" />
              ))}
            </div>
          ) : error ? (
            <div className="card p-16 text-center">
              <p className="text-text-muted mb-4">{error}</p>
              <LiquidButton size="default" onClick={() => window.location.reload()} className="!text-text-primary font-medium">Try Again</LiquidButton>
            </div>
          ) : products.length === 0 ? (
            <div className="card p-16 text-center">
              <p className="text-text-muted mb-4">No products found matching your criteria.</p>
              <LiquidButton size="default" onClick={() => navigate("/shop")} className="!text-text-primary font-medium">Clear Filters</LiquidButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map(p => (
                <Link key={p.id} to={`/product/${p.id}`}>
                  <ProductCard product={p} />
                </Link>
              ))}
            </div>
          )}

          <div ref={loadMoreRef} className="mt-16 py-8 flex flex-col items-center justify-center">
            {loading && products.length > 0 && (
              <div className="w-6 h-6 border-2 border-text-primary border-t-transparent rounded-full animate-spin" />
            )}
            {!hasMore && products.length > 0 && (
              <p className="text-xs text-text-muted">You've seen everything</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

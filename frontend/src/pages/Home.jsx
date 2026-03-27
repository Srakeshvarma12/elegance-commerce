import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "../services/productService";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const f = await getFeaturedProducts();
        const l = await getLatestProducts();
        setFeatured(f.results || []);
        setLatest(l.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const heroProduct = featured.find(p => p.id === 101) || featured[0];
  const sideProducts = featured.slice(1, 4);

  return (
    <main className="w-full min-h-screen bg-bg-primary">

      {/* ═══════════ HERO ═══════════ */}
      <section className="section-container pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[520px]">
          {/* Left — Copy */}
          <div className="flex flex-col justify-center animate-slideUp">
            <p className="label mb-4 text-accent">New Arrivals</p>
            <h1 className="heading-xl mb-6">
              Sound Perfected.{" "}
              <span className="text-text-muted">Design Elevated.</span>
            </h1>
            <p className="body-lg max-w-lg mb-10">
              Experience premium audio and tech products crafted for those who demand
              excellence in every detail of their daily life.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <LiquidButton
                size="xl"
                onClick={() => navigate('/shop')}
                className="!text-text-primary font-semibold"
              >
                Shop Collection →
              </LiquidButton>
              {heroProduct && (
                <LiquidButton
                  size="lg"
                  onClick={() => navigate(`/product/${heroProduct.id}`)}
                  className="!text-text-secondary font-medium"
                >
                  View Featured
                </LiquidButton>
              )}
            </div>
          </div>

          {/* Right — Hero Image */}
          <div className="relative flex items-center justify-center">
            <div className="w-full aspect-square max-w-lg mx-auto bg-bg-subtle rounded-[2rem] flex items-center justify-center p-10 overflow-hidden group">
              {heroProduct?.image && (
                <img
                  src={heroProduct.image}
                  alt={heroProduct?.name || "Featured product"}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-lg"
                />
              )}
            </div>
            {/* Floating thumbnails */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              {sideProducts.map(p => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="w-14 h-14 rounded-xl bg-white border border-border p-1.5 shadow-sm hover:shadow-md hover:scale-105 transition-all"
                >
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORY TILES ═══════════ */}
      <section className="section-container pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Audio", icon: "🎧", bg: "bg-[#F0EDE8]" },
            { name: "Wearables", icon: "⌚", bg: "bg-[#E8EDF0]" },
            { name: "TV & Video", icon: "📺", bg: "bg-[#EDE8F0]" },
            { name: "Accessories", icon: "🔌", bg: "bg-[#E8F0EB]" },
          ].map(cat => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className={`${cat.bg} rounded-2xl p-6 md:p-8 flex flex-col items-center gap-3 hover:shadow-md transition-all group`}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-sm font-semibold tracking-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════ FEATURED PRODUCTS ═══════════ */}
      {featured.length > 0 && (
        <section className="section-container pb-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              {/* <p className="label mb-2">Curated</p> */}
              <h2 className="heading-lg">Featured Products</h2>
            </div>
            <LiquidButton size="default" onClick={() => navigate('/shop')} className="!text-text-secondary text-sm font-medium">
              View All →
            </LiquidButton>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="block">
                <ProductCard product={p} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════ BRAND PROMISE ═══════════ */}
      <section className="bg-bg-dark text-white py-20 md:py-28">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="label mb-3 !text-accent">Why ELEGANCE</p>
            <h2 className="heading-lg !text-white">Crafted for the Discerning</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {[
              { title: "Precision Engineering", desc: "Every product undergoes rigorous quality testing to meet the highest standards of performance and durability." },
              { title: "Thoughtful Design", desc: "Clean lines, premium materials, and intuitive interfaces — designed to complement your lifestyle seamlessly." },
              { title: "Dedicated Support", desc: "Industry-leading warranty coverage with 24/7 expert support from our dedicated product specialists." },
            ].map((item, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-5 mx-auto md:mx-0">
                  <span className="text-accent font-bold text-sm">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-lg font-semibold mb-3 tracking-tight">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════ LATEST ARRIVALS ═══════════ */}
      {latest.length > 0 && (
        <section className="section-container pb-28">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label mb-2">Just In</p>
              <h2 className="heading-lg">Latest Arrivals</h2>
            </div>
            <LiquidButton size="default" onClick={() => navigate('/shop')} className="!text-text-secondary text-sm font-medium">
              Shop All →
            </LiquidButton>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.slice(0, 4).map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="block">
                <ProductCard product={p} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════ NEWSLETTER CTA ═══════════ */}
      <section className="section-container pb-28">
        <div className="bg-bg-subtle rounded-2xl p-10 md:p-16 text-center">
          <p className="label mb-3 text-accent">Stay Updated</p>
          <h2 className="heading-md mb-4">Join the ELEGANCE Community</h2>
          <p className="body-sm max-w-md mx-auto mb-8">
            Be the first to know about new product launches, exclusive offers, and behind-the-scenes stories.
          </p>
          <LiquidButton size="xl" onClick={() => navigate('/register')} className="!text-text-primary font-semibold">
            Create Account →
          </LiquidButton>
        </div>
      </section>
    </main>
  );
}
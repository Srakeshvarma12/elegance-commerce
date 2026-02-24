import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "../services/productService";

export default function Home() {
  const slides = [
    {
      img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000",
      subtitle: "Spring Collection 2026",
      title: "Timeless Elegance",
      desc: "Discover our curated collection of premium fashion and accessories designed for those who appreciate sophistication."
    },
    {
      img: "https://images.unsplash.com/photo-1590739225287-bd31519780c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzN8fGx1eGUlMjBmYXNoaW9ufGVufDB8fDB8fHww",
      subtitle: "Luxury Edition",
      title: "Modern Prestige",
      desc: "Experience refined craftsmanship blended with contemporary design."
    },
    {
      img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
      subtitle: "New Arrivals",
      title: "Style Redefined",
      desc: "Explore bold silhouettes crafted for modern icons."
    }
  ];

  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

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

  const handleMouseMove = e => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 30;
    const y = (e.clientY / innerHeight - 0.5) * 30;
    setOffset({ x, y });
  };

  const slide = slides[index];

  const categories = [...new Set([...featured, ...latest].map(p => p.category))].filter(Boolean);

  return (
    <div className="w-full">

      {/* HERO */}
      <section
        onMouseMove={handleMouseMove}
        className="relative h-screen w-full overflow-hidden select-none"
      >
        {slides.map((s, i) => (
          <img
            key={i}
            src={s.img}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-out ${i === index ? "opacity-100 scale-110" : "opacity-0 scale-100"
              }`}
            style={{
              transform:
                i === index
                  ? `scale(1.1) translate(${offset.x}px, ${offset.y}px)`
                  : "scale(1)"
            }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-5xl px-6 ml-6 md:ml-24 text-white">

            <p className="uppercase tracking-widest text-sm mb-4">
              {slide.subtitle}
            </p>

            <h1 className="text-5xl md:text-7xl font-serif mb-8">
              {slide.title}
            </h1>

            <p className="max-w-xl mb-10 leading-8 opacity-90">
              {slide.desc}
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 uppercase tracking-widest text-sm transition hover:bg-black hover:text-white hover:scale-105"
            >
              Explore Collection →
            </Link>

            <div className="flex gap-3 mt-14">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`h-[3px] rounded-full transition-all duration-500 ${i === index ? "w-10 bg-white" : "w-4 bg-white/40"
                    }`}
                />
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* DYNAMIC CATEGORIES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-serif text-center mb-14">
            Shop By Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

            {categories.map(cat => {

              const item = [...featured, ...latest].find(p => p.category === cat);

              return (
                <Link
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  key={cat}
                  className="group text-center"
                >

                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={item?.image}
                      className="w-full h-full object-cover transition group-hover:scale-110"
                    />
                  </div>

                  <p className="mt-4 font-medium tracking-wide">
                    {cat}
                  </p>

                </Link>
              );
            })}

          </div>
        </div>
      </section>


      {/* FEATURED */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-serif mb-12 text-center">
            Featured Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {loading
              ? [...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-xl" />
                  <div className="h-4 bg-gray-200 mt-4 w-2/3" />
                  <div className="h-4 bg-gray-200 mt-2 w-1/3" />
                </div>
              ))
              : featured.map(p => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="transition hover:-translate-y-2 duration-300 block"
                >
                  <ProductCard product={p} />
                </Link>
              ))}

          </div>
        </div>
      </section>


      {/* LATEST */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-serif mb-12 text-center">
            Latest Arrivals
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {loading
              ? [...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-xl" />
                  <div className="h-4 bg-gray-200 mt-4 w-2/3" />
                  <div className="h-4 bg-gray-200 mt-2 w-1/3" />
                </div>
              ))
              : latest.map(p => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="transition hover:-translate-y-2 duration-300 block"
                >
                  <ProductCard product={p} />
                </Link>
              ))}

          </div>
        </div>
      </section>

    </div>
  );
}
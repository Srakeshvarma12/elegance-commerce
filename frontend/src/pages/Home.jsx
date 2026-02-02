import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full">
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src="https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b6aac56?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWNvbW1lcmNlfGVufDB8fDB8fHww?auto=format&fit=crop&w=5400&q=100"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-5xl px-6 ml-6 md:ml-24 text-white">
            <p className="uppercase tracking-widest text-sm mb-4">
              Spring Collection 2026
            </p>

            <h1 className="text-5xl md:text-7xl font-serif mb-8">
              Timeless Elegance
            </h1>

            <p className="max-w-xl mb-10 leading-8">
              Discover our curated collection of premium fashion and accessories,
              designed for those who appreciate sophistication.
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 uppercase tracking-widest text-sm hover:bg-black hover:text-white transition"
            >
              Explore Collection →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-28 bg-gray-50">
        <div className="container-max grid md:grid-cols-3 gap-16 text-center">
          <div>
            <h3 className="text-xl font-serif mb-4">
              Precision Crafted
            </h3>
            <p className="text-gray-600 leading-7">
              Engineered with world-class accuracy and attention to detail.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-serif mb-4">
              Premium Materials
            </h3>
            <p className="text-gray-600 leading-7">
              Sapphire glass, surgical steel, and elite-grade mechanisms.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-serif mb-4">
              Modern Heritage
            </h3>
            <p className="text-gray-600 leading-7">
              A balance between classic elegance and modern minimalism.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

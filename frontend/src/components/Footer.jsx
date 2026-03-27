import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-white mt-24">
      <div className="section-container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-xl font-bold tracking-[-0.04em]">ELEGANCE</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Premium technology products designed for those who appreciate the intersection of innovation, craftsmanship, and everyday elegance.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold mb-6 text-white/80">Products</h4>
            <ul className="space-y-3.5">
              <li><Link to="/shop?category=Audio" className="text-sm text-white/40 hover:text-white transition-colors">Audio</Link></li>
              <li><Link to="/shop?category=TV%20%26%20Video" className="text-sm text-white/40 hover:text-white transition-colors">TV & Video</Link></li>
              <li><Link to="/shop?category=Wearables" className="text-sm text-white/40 hover:text-white transition-colors">Wearables</Link></li>
              <li><Link to="/shop?category=Accessories" className="text-sm text-white/40 hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold mb-6 text-white/80">Support</h4>
            <ul className="space-y-3.5">
              <li><Link to="/orders" className="text-sm text-white/40 hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/shop" className="text-sm text-white/40 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/shop" className="text-sm text-white/40 hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/shop" className="text-sm text-white/40 hover:text-white transition-colors">Shipping Info</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-6 text-white/80">Company</h4>
            <ul className="space-y-3.5">
              <li><span className="text-sm text-white/40">Privacy Policy</span></li>
              <li><span className="text-sm text-white/40">Terms of Service</span></li>
              <li><span className="text-sm text-white/40">hello@elegance.io</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">© 2026 ELEGANCE. All rights reserved.</p>
          <div className="flex gap-5 items-center">
            {/* X / Twitter */}
            <a href="#" className="text-white/30 hover:text-white/70 transition-colors" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="text-white/30 hover:text-white/70 transition-colors" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" className="text-white/30 hover:text-white/70 transition-colors" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="text-white/30 hover:text-white/70 transition-colors" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

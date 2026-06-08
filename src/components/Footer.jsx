import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy text-white pt-14 pb-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center lg:text-left">

          {/* Logo / about column */}
          <div className="lg:pr-4">
            <Link to="/" className="inline-block mb-4">
              <img src="/images/logo.png" alt="NORA" className="h-auto w-24" />
            </Link>
            <p className="text-skyblue/80 text-sm leading-relaxed">
              Timeless silhouettes, premium fabrics, and quiet confidence — crafted for everyday elegance.
            </p>
            <div className="flex justify-center lg:justify-start gap-3 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-teal transition-colors">
                <img src="/icons/facebook.png" alt="" className="w-4 h-4" onError={(e) => e.target.style.display = 'none'} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-teal transition-colors">
                <img src="/icons/instagram.png" alt="" className="w-4 h-4" onError={(e) => e.target.style.display = 'none'} />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X"
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-teal transition-colors">
                <img src="/icons/x.png" alt="" className="w-4 h-4" onError={(e) => e.target.style.display = 'none'} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-skyblue">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/features" className="text-white/70 hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/about" className="text-white/70 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/orders" className="text-white/70 hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-skyblue">Categories</h4>
            <ul className="space-y-2.5">
              <li><Link to="/features?category=women" className="text-white/70 hover:text-white transition-colors">Women</Link></li>
              <li><Link to="/features?category=men" className="text-white/70 hover:text-white transition-colors">Men</Link></li>
              <li><Link to="/features?category=kids" className="text-white/70 hover:text-white transition-colors">Kids</Link></li>
              <li><Link to="/features?category=accessories" className="text-white/70 hover:text-white transition-colors">Accessories</Link></li>
              <li><Link to="/features?category=sale" className="text-white/70 hover:text-white transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-skyblue">Get in Touch</h4>
            <ul className="space-y-3 text-white/70 text-sm">
              <li className="flex items-center justify-center lg:justify-start gap-2">
                <svg className="w-4 h-4 text-teal shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@noraclothing.com
              </li>
              <li className="flex items-center justify-center lg:justify-start gap-2">
                <svg className="w-4 h-4 text-teal shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +1 (555) 012-3456
              </li>
              <li className="flex items-center justify-center lg:justify-start gap-2">
                <svg className="w-4 h-4 text-teal shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                123 Fashion Ave, New York, NY
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/15 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <p>© {new Date().getFullYear()} Nora Clothing. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

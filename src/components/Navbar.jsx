import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useUser } from '../contexts/UserContext';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';

// Self-contained user menu — manages its own open/close state and outside-click
// handling so it works correctly regardless of which breakpoint is visible.
function UserMenu({ user, logout, navigate, iconSize = 'w-6 h-6' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onEsc     = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center focus:outline-none"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <img src="/icons/user.png" alt="Account" className={`${iconSize} object-contain`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white text-navy rounded-xl shadow-xl border border-skyblue/60 z-[60] overflow-hidden">
          {!user ? (
            <Link
              to="/auth"
              className="block px-4 py-3 hover:bg-beige text-sm font-medium transition-colors"
              onClick={close}
            >
              Sign In
            </Link>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-skyblue/40 text-sm text-teal bg-beige/60 font-medium">
                Hello, {user.name?.split(' ')[0] || 'User'}
              </div>
              <Link to="/cart"    className="block px-4 py-3 hover:bg-beige text-sm transition-colors" onClick={close}>Cart</Link>
              <Link to="/profile" className="block px-4 py-3 hover:bg-beige text-sm transition-colors" onClick={close}>Profile</Link>
              <Link to="/orders"  className="block px-4 py-3 hover:bg-beige text-sm transition-colors" onClick={close}>My Orders</Link>
              <button
                onClick={() => { logout(); close(); navigate('/'); }}
                className="w-full text-left px-4 py-3 hover:bg-beige text-sm text-red-600 transition-colors border-t border-skyblue/30"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { cartCount }     = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout }  = useUser();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((o) => !o);
  const closeSidebar  = () => setSidebarOpen(false);

  const scrollToSection = (sectionId) => {
    const scroll = () => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scroll, 300);
    } else {
      scroll();
    }
  };

  const categoryMapping = {
    Casual: 'casual', Maxi: 'maxi', Mini: 'mini', Office: 'office', Party: 'party',
    Blazers: 'blazers', Cardigans: 'cardigans', Coats: 'coats', Hoodies: 'hoodies', Jackets: 'jackets',
    Blouses: 'blouses', 'Crop Tops': 'crop tops', Shirts: 'shirts', 'Tank Tops': 'tank tops', 'T-Shirts': 't-shirts',
    Jeans: 'jeans', Leggings: 'leggings', Shorts: 'shorts', Skirts: 'skirts', Trousers: 'trousers',
    Bags: 'bags', Belts: 'belts', Jewelry: 'jewelry', Sunglasses: 'sunglasses', Watches: 'watches',
  };

  const categories = [
    { name: 'Dresses',     items: ['Casual', 'Maxi', 'Mini', 'Office', 'Party'] },
    { name: 'Outerwear',   items: ['Blazers', 'Cardigans', 'Coats', 'Hoodies', 'Jackets'] },
    { name: 'Tops',        items: ['Blouses', 'Crop Tops', 'Shirts', 'Tank Tops', 'T-Shirts'] },
    { name: 'Bottoms',     items: ['Jeans', 'Leggings', 'Shorts', 'Skirts', 'Trousers'] },
    { name: 'Accessories', items: ['Bags', 'Belts', 'Jewelry', 'Sunglasses', 'Watches'] },
  ];

  return (
    <>
      <nav className="bg-teal text-white p-4 font-sansita">
        <div className="container mx-auto px-4">

          {/* ── Mobile / Tablet layout (< md) ─────────────────────────────── */}
          <div className="flex justify-between items-center md:hidden">
            {/* Left: hamburger */}
            <button
              onClick={toggleSidebar}
              className="text-2xl focus:outline-none p-1 -ml-1"
              aria-label="Open menu"
            >
              ☰
            </button>

            {/* Centre: logo */}
            <Link to="/" className="flex items-center absolute left-1/2 -translate-x-1/2">
              <img src="/images/logo.png" alt="Nora Clothing" className="h-10 w-auto" />
            </Link>

            {/* Right: user icon → cart icon */}
            <div className="flex items-center gap-3">
              <UserMenu user={user} logout={logout} navigate={navigate} iconSize="w-7 h-7" />

              <Link to="/cart" className="relative" aria-label="Cart">
                <img src="/icons/cart.png" alt="Cart" className="w-8 h-8" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* ── Desktop layout (≥ md) ─────────────────────────────────────── */}
          <div className="hidden md:flex md:justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src="/images/logo.png" alt="Nora Clothing" className="h-12 w-auto" />
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-8">
              <Link to="/" className="hover:text-white transition">Home</Link>

              {/* Features mega-dropdown */}
              <div className="relative group">
                <button className="hover:text-white flex items-center gap-1.5 transition-colors">
                  Features
                  <img src="/icons/expand.png" alt="" className="w-4 h-4 inline-block transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="absolute left-0 top-full pt-3 w-64 z-50 opacity-0 invisible -translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out">
                  <div className="bg-white rounded-xl shadow-xl border border-skyblue/60 overflow-hidden py-2">
                    {categories.map((cat) => (
                      <div key={cat.name} className="relative group/sub">
                        <div className="px-4 py-2.5 hover:bg-beige cursor-pointer flex justify-between items-center text-navy text-sm font-medium whitespace-nowrap transition-colors">
                          {cat.name}
                          <img src="/icons/expand1.png" alt="" className="w-3 h-3 ml-3 flex-shrink-0 -rotate-90" />
                        </div>
                        <div className="absolute left-full top-0 pl-2 w-56 z-50 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-opacity duration-150">
                          <div className="bg-white rounded-xl shadow-xl border border-skyblue/60 overflow-hidden py-2">
                            {cat.items.map((item) => (
                              <Link
                                key={item}
                                to={`/features?category=${encodeURIComponent(categoryMapping[item])}`}
                                className="block px-4 py-2.5 hover:bg-beige text-navy text-sm whitespace-nowrap transition-colors"
                              >
                                {item}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={() => scrollToSection('best-sellers')} className="hover:text-white transition">Best Sellers</button>
              <button onClick={() => scrollToSection('new-arrivals')}  className="hover:text-white transition">New Arrivals</button>
              <Link to="/contact" className="hover:text-white transition">Contact</Link>
            </div>

            {/* Right icons */}
            <div className="flex gap-4 items-center">
              <SearchBar />

              <UserMenu user={user} logout={logout} navigate={navigate} iconSize="w-6 h-6" />

              <Link to="/wishlist" className="relative" aria-label="Wishlist">
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative" aria-label="Cart">
                <img src="/icons/cart.png" alt="Cart" className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

        </div>
      </nav>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} scrollToSection={scrollToSection} />
    </>
  );
}

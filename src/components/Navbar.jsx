import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useUser } from '../contexts/UserContext';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleUserDropdown = () => setUserDropdownOpen((open) => !open);

  // Close the user dropdown when clicking outside it or pressing Escape
  useEffect(() => {
    if (!userDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    const handleEscape = (e) => { if (e.key === 'Escape') setUserDropdownOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [userDropdownOpen]);

  const scrollToSection = (sectionId) => {
    const scroll = () => {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    };
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for the home page to mount before looking up the section.
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
    Bags: 'bags', Belts: 'belts', Jewelry: 'jewelry', Sunglasses: 'sunglasses', Watches: 'watches'
  };

  const categories = [
    { name: 'Dresses', items: ['Casual', 'Maxi', 'Mini', 'Office', 'Party'] },
    { name: 'Outerwear', items: ['Blazers', 'Cardigans', 'Coats', 'Hoodies', 'Jackets'] },
    { name: 'Tops', items: ['Blouses', 'Crop Tops', 'Shirts', 'Tank Tops', 'T-Shirts'] },
    { name: 'Bottoms', items: ['Jeans', 'Leggings', 'Shorts', 'Skirts', 'Trousers'] },
    { name: 'Accessories', items: ['Bags', 'Belts', 'Jewelry', 'Sunglasses', 'Watches'] }
  ];

  return (
    <>
      <nav className="bg-teal text-white p-4 font-sansita">
        <div className="container mx-auto px-4">
          {/* Mobile layout */}
          <div className="flex justify-between items-center md:hidden">
            <button onClick={toggleSidebar} className="text-2xl focus:outline-none">☰</button>
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="Nora Clothing" className="h-10 w-auto" />
            </Link>
            <Link to="/cart" className="relative">
              <img src="/icons/cart.png" alt="Cart" className="w-8 h-8" />
              {cartCount > 0 && <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">{cartCount}</span>}
            </Link>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex md:justify-between items-center">
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="Nora Clothing" className="h-12 w-auto" />
            </Link>
            <div className="flex items-center gap-8">
              <Link to="/" className="hover:text-white transition">Home</Link>
              
              {/* Features Dropdown */}
              <div className="relative group">
                <button className="hover:text-white flex items-center gap-1.5 transition-colors">
                  Features
                  <img src="/icons/expand.png" alt="" className="w-4 h-4 inline-block transition-transform duration-200 group-hover:rotate-180" />
                </button>
                {/* pt-3 (padding, not margin) keeps the hover region continuous between the button and panel */}
                <div className="absolute left-0 top-full pt-3 w-64 z-50 opacity-0 invisible -translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out">
                  <div className="bg-white rounded-xl shadow-xl border border-skyblue/60 overflow-hidden py-2">
                    {categories.map((cat) => (
                      <div key={cat.name} className="relative group/sub">
                        <div className="px-4 py-2.5 hover:bg-beige cursor-pointer flex justify-between items-center text-navy text-sm font-medium whitespace-nowrap transition-colors">
                          {cat.name}
                          <img src="/icons/expand1.png" alt="" className="w-3 h-3 ml-3 flex-shrink-0 -rotate-90" />
                        </div>
                        {/* pl-2 (padding) replaces the old ml-1 margin gap that broke hover continuity */}
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
              <button onClick={() => scrollToSection('new-arrivals')} className="hover:text-white transition">New Arrivals</button>
              <Link to="/contact" className="hover:text-white transition">Contact</Link>
            </div>
            <div className="flex gap-4 items-center">
              <SearchBar />
              
              {/* User dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <img src="/icons/user.png" alt="Account" className="w-6 h-6 cursor-pointer" onClick={toggleUserDropdown} />
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white text-navy rounded-xl shadow-xl border border-skyblue/60 z-50 overflow-hidden">
                    {!user ? (
                      <Link to="/auth" className="block px-4 py-2.5 hover:bg-beige text-sm transition-colors" onClick={() => setUserDropdownOpen(false)}>Sign In</Link>
                    ) : (
                      <>
                        <div className="px-4 py-2.5 border-b border-skyblue/60 text-sm text-teal bg-beige/60">
                          Hello, {user.name?.split(' ')[0] || 'User'}
                        </div>
                        <Link to="/cart" className="block px-4 py-2.5 hover:bg-beige text-sm transition-colors" onClick={() => setUserDropdownOpen(false)}>Cart</Link>
                        <Link to="/profile" className="block px-4 py-2.5 hover:bg-beige text-sm transition-colors" onClick={() => setUserDropdownOpen(false)}>Profile</Link>
                        <Link to="/orders" className="block px-4 py-2.5 hover:bg-beige text-sm transition-colors" onClick={() => setUserDropdownOpen(false)}>My Orders</Link>
                        <button onClick={() => { logout(); setUserDropdownOpen(false); navigate('/'); }} className="block w-full text-left px-4 py-2.5 hover:bg-beige text-sm text-red-600 transition-colors">Logout</button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Link to="/wishlist" className="relative" aria-label="Wishlist">
                <Heart size={22} />
                {wishlistCount > 0 && <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">{wishlistCount}</span>}
              </Link>

              <Link to="/cart" className="relative">
                <img src="/icons/cart.png" alt="Cart" className="w-6 h-6" />
                {cartCount > 0 && <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} scrollToSection={scrollToSection} />
    </>
  );
}
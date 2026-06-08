import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import { motion } from 'framer-motion';

const BADGES = [
  { key: 'isNewArrival', label: 'New', className: 'bg-teal text-white' },
  { key: 'isOnSale', label: 'Sale', className: 'bg-navy text-white' },
  { key: 'isTrending', label: 'Trending', className: 'bg-skyblue text-navy' },
];

export default function ProductCard({ product, onQuickView }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useUser();
  const { showToast } = useToast();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [imgLoaded, setImgLoaded] = useState(false);

  const productImage = product.images?.[0] || product.imageUrl || '/placeholder.jpg';
  const rating = product.rating ?? 4.5;
  const wishlisted = isWishlisted(product._id);
  const activeBadges = BADGES.filter(b => product[b.key]);

  const requireLogin = (action) => {
    if (!user) {
      showToast('Please login to continue', 'warning');
      return false;
    }
    return action();
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    requireLogin(() => {
      addToCart(product, 1);
      showToast(`${product.name} added to cart!`, 'success');
    });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    requireLogin(() => {
      const added = toggleWishlist(product);
      if (added) showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'success');
    });
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <motion.div
      onClick={() => navigate(`/product/${product._id}`)}
      className="group bg-white rounded-2xl overflow-hidden border border-skyblue/60 shadow-sm hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <div className="relative overflow-hidden aspect-square bg-beige">
        {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-skyblue/40" />}
        <img
          src={productImage}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Badges */}
        {activeBadges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {activeBadges.map(b => (
              <span key={b.key} className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm ${b.className}`}>
                {b.label}
              </span>
            ))}
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-2 shadow-md hover:bg-white transition-colors duration-200"
        >
          <Heart size={18} className={wishlisted ? 'fill-navy text-navy' : 'text-navy/70'} />
        </button>

        {/* Hover action row */}
        <div className="absolute bottom-0 inset-x-0 flex gap-2 p-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleQuickView}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white text-navy text-sm font-semibold py-2.5 rounded-xl shadow-md hover:bg-skyblue transition-colors duration-200"
          >
            <Eye size={16} /> Quick View
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-navy text-white text-sm font-semibold py-2.5 rounded-xl shadow-md hover:bg-teal transition-colors duration-200"
          >
            <ShoppingBag size={16} /> Add to Cart
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-teal text-xs font-semibold uppercase tracking-wide">{product.category}</p>
        <h3 className="font-bold text-base text-navy mt-0.5 truncate">{product.name}</h3>

        <div className="flex items-center gap-1 mt-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-skyblue'}
            />
          ))}
          <span className="text-xs text-teal ml-1">({product.reviewCount ?? 0})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <p className="text-navy font-bold text-xl">${product.price}</p>
          {product.oldPrice && (
            <p className="text-teal/70 text-sm line-through">${product.oldPrice}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

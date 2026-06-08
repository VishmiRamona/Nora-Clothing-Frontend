import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      showToast('Please login to view your wishlist', 'warning');
      navigate('/auth', { replace: true });
    }
  }, [user, navigate, showToast]);

  if (!user) return null;

  const handleMoveToCart = (item) => {
    addToCart({ _id: item.productId, name: item.name, price: item.price, images: [item.image] }, 1);
    removeFromWishlist(item.productId);
    showToast(`${item.name} moved to cart!`, 'success');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto py-24 px-4 text-center">
        <Heart size={48} className="mx-auto text-skyblue" />
        <h2 className="text-2xl font-bold text-navy mt-4">Your wishlist is empty</h2>
        <p className="text-teal mt-2">Save items you love so you can find them easily later.</p>
        <Link to="/features" className="inline-block mt-6 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal transition-colors">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-navy mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map(item => (
          <div key={item.productId} className="group bg-white rounded-2xl overflow-hidden border border-skyblue/60 shadow-sm hover:shadow-xl transition-shadow duration-300">
            <Link to={`/product/${item.productId}`} className="block relative overflow-hidden aspect-square bg-beige">
              <img
                src={item.image || '/placeholder.jpg'}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </Link>

            <div className="p-4">
              <p className="text-teal text-xs font-semibold uppercase tracking-wide">{item.category}</p>
              <Link to={`/product/${item.productId}`}>
                <h3 className="font-bold text-base text-navy mt-0.5 truncate hover:text-teal transition-colors">{item.name}</h3>
              </Link>
              <p className="text-navy font-bold text-xl mt-2">${item.price}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-navy text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-teal transition-colors"
                >
                  <ShoppingBag size={16} /> Move to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  aria-label="Remove from wishlist"
                  className="p-2.5 rounded-xl border border-skyblue text-teal hover:text-red-500 hover:border-red-300 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

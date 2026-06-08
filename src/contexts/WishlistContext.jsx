import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useUser();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`wishlist_${user.id}`);
      setWishlistItems(saved ? JSON.parse(saved) : []);
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  const isWishlisted = (productId) => wishlistItems.some(item => item.productId === productId);

  const toggleWishlist = (product) => {
    if (!user) return false;
    setWishlistItems(prev => {
      if (prev.some(item => item.productId === product._id)) {
        return prev.filter(item => item.productId !== product._id);
      }
      return [...prev, {
        productId: product._id,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.images?.[0] || product.imageUrl
      }];
    });
    return true;
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item.productId !== productId));
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      wishlistCount: wishlistItems.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

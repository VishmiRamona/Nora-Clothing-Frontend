import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
    setLoading(false);
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user && !loading) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user, loading]);

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      alert('Please login to add items to your cart');
      return;
    }
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === product._id);
      if (existing) {
        return prev.map(item =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.images?.[0] || product.imageUrl || '',
        quantity
      }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (!user) return;
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId) => {
    if (!user) return;
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    if (!user) return;
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      getCartTotal,
      cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
};
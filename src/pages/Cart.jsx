import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';
import CartItemCard from '../components/CartItemCard';
import OrderSummary from '../components/OrderSummary';

export default function Cart() {
  const { cartItems, updateQuantity, removeItem, getCartTotal, clearCart } = useCart();
  const { user } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState({ name: '', email: '', address: '' });
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (!user) {
      showToast('Please login to view your cart', 'warning');
      navigate('/auth', { replace: true });
    }
  }, [user, navigate, showToast]);

  if (!user) return null;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    try {
      const order = {
        customerName: checkoutData.name,
        customerEmail: checkoutData.email,
        customerAddress: checkoutData.address,
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: getCartTotal()
      };

      await api.post('/orders', order);
      showToast('Order placed successfully!', 'success');
      clearCart();
      setCheckoutData({ name: '', email: '', address: '' });
      setShowCheckout(false);
    } catch (error) {
      showToast('Error placing order. Please try again.', 'error');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-24 px-4 text-center">
        <ShoppingBag size={48} className="mx-auto text-skyblue" />
        <h2 className="text-2xl font-bold text-navy mt-4">Your cart is empty</h2>
        <p className="text-teal mt-2">Looks like you haven't added anything yet.</p>
        <Link to="/features" className="inline-block mt-6 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-navy mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <CartItemCard
              key={item.productId}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}

          {showCheckout && (
            <form onSubmit={handleCheckout} className="bg-white rounded-2xl border border-skyblue/60 p-6 space-y-4 mt-6">
              <h2 className="text-lg font-bold text-navy">Checkout Details</h2>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={checkoutData.name}
                onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                className="w-full border border-skyblue rounded-lg px-3 py-2.5 text-sm text-navy outline-none focus:border-navy"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={checkoutData.email}
                onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                className="w-full border border-skyblue rounded-lg px-3 py-2.5 text-sm text-navy outline-none focus:border-navy"
              />
              <textarea
                placeholder="Shipping Address"
                required
                rows={3}
                value={checkoutData.address}
                onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                className="w-full border border-skyblue rounded-lg px-3 py-2.5 text-sm text-navy outline-none focus:border-navy"
              />
              <button type="submit" className="w-full bg-navy text-white font-bold py-3 rounded-xl hover:bg-teal transition-colors">
                Place Order
              </button>
            </form>
          )}
        </div>

        {/* Sticky summary */}
        <div className="lg:sticky lg:top-24">
          <OrderSummary
            subtotal={getCartTotal()}
            onCheckout={() => setShowCheckout(true)}
            checkoutLabel={showCheckout ? 'Fill details below ↓' : 'Proceed to Checkout'}
            disabled={showCheckout}
          />
        </div>
      </div>
    </div>
  );
}

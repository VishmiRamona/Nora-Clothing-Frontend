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
  const { cartItems, loading: cartLoading, updateQuantity, removeItem, getCartTotal, clearCart } = useCart();
  const { user, loading: userLoading } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState({ name: '', email: '', phone: '', address: '' });
  const [formErrors, setFormErrors] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);

  // Wait for both user and cart to be loaded before doing anything
  useEffect(() => {
    if (!userLoading && !cartLoading) {
      if (!user) {
        showToast('Please login to view your cart', 'warning');
        navigate('/auth', { replace: true });
      }
    }
  }, [userLoading, cartLoading, user, navigate, showToast]);

  // Show loading spinner while checking auth / cart
  if (userLoading || cartLoading) {
    return (
      <div className="container mx-auto py-24 px-4 text-center">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-navy mt-4">Loading your cart...</p>
      </div>
    );
  }

  if (!user) return null;

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateForm = () => {
    const errors = {};
    const { name, email, phone, address } = checkoutData;

    if (!name.trim()) {
      errors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^\d{10}$/;
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone)) {
      errors.phone = 'Phone number must be exactly 10 digits (numbers only)';
    }

    if (!address.trim()) {
      errors.address = 'Shipping address is required';
    } else if (address.trim().length < 5) {
      errors.address = 'Address must be at least 5 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    try {
      const order = {
        customerName: checkoutData.name.trim(),
        customerEmail: checkoutData.email.trim(),
        customerPhone: checkoutData.phone.trim(),
        customerAddress: checkoutData.address.trim(),
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: getCartTotal(),
      };

      await api.post('/orders', order);
      showToast('Order placed successfully!', 'success');
      clearCart();
      setCheckoutData({ name: '', email: '', phone: '', address: '' });
      setFormErrors({});
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
        <Link
          to="/features"
          className="inline-block mt-6 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-navy mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItemCard
              key={item.productId}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}

          {showCheckout && (
            <form
              onSubmit={handleCheckout}
              className="bg-white rounded-2xl border border-skyblue/60 p-6 space-y-4 mt-6"
            >
              <h2 className="text-lg font-bold text-navy">Checkout Details</h2>

              <div>
                <input
                  type="text"
                  id="checkout-name"
                  name="name"
                  placeholder="Full Name"
                  autoComplete="name"
                  required
                  value={checkoutData.name}
                  onChange={(e) => {
                    setCheckoutData({ ...checkoutData, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                  }}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm text-navy outline-none focus:border-navy ${
                    formErrors.name ? 'border-red-500' : 'border-skyblue'
                  }`}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  id="checkout-email"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                  required
                  value={checkoutData.email}
                  onChange={(e) => {
                    setCheckoutData({ ...checkoutData, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                  }}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm text-navy outline-none focus:border-navy ${
                    formErrors.email ? 'border-red-500' : 'border-skyblue'
                  }`}
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  id="checkout-phone"
                  name="phone"
                  placeholder="Phone Number (10 numbers)"
                  autoComplete="tel"
                  required
                  maxLength="10"
                  value={checkoutData.phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '');
                    setCheckoutData({ ...checkoutData, phone: digits });
                    if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                  }}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm text-navy outline-none focus:border-navy ${
                    formErrors.phone ? 'border-red-500' : 'border-skyblue'
                  }`}
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <textarea
                  placeholder="Shipping Address"
                  required
                  rows={3}
                  value={checkoutData.address}
                  onChange={(e) => {
                    setCheckoutData({ ...checkoutData, address: e.target.value });
                    if (formErrors.address) setFormErrors({ ...formErrors, address: '' });
                  }}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm text-navy outline-none focus:border-navy ${
                    formErrors.address ? 'border-red-500' : 'border-skyblue'
                  }`}
                />
                {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-navy text-white font-bold py-3 rounded-xl hover:bg-teal transition-colors"
              >
                Place Order
              </button>
            </form>
          )}
        </div>

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
import { useState } from 'react';

const SHIPPING_THRESHOLD = 180;
const SHIPPING_FEE = 12;
const TAX_RATE = 0.08;
const COUPONS = { SAVE10: 0.1, WELCOME20: 0.2 };

export default function OrderSummary({ subtotal, onCheckout, checkoutLabel = 'Proceed to Checkout', disabled }) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = subtotal * TAX_RATE;
  const discountRate = appliedCoupon ? COUPONS[appliedCoupon] : 0;
  const discount = subtotal * discountRate;
  const total = subtotal + shipping + tax - discount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError('');
    } else {
      setAppliedCoupon(null);
      setCouponError('Invalid coupon code');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-skyblue/60 p-6">
      <h2 className="text-lg font-bold text-navy mb-5">Order Summary</h2>

      <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-5">
        <input
          type="text"
          id="coupon-code"
          name="couponCode"
          placeholder="Coupon code"
          autoComplete="off"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="flex-1 border border-skyblue rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-navy"
        />
        <button type="submit" className="bg-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal transition-colors">
          Apply
        </button>
      </form>
      {couponError && <p className="text-red-500 text-xs -mt-3 mb-4">{couponError}</p>}
      {appliedCoupon && <p className="text-teal text-xs -mt-3 mb-4">Coupon <span className="font-semibold text-navy">{appliedCoupon}</span> applied — {(discountRate * 100).toFixed(0)}% off</p>}

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-teal">
          <span>Subtotal</span>
          <span className="text-navy font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-teal">
          <span>Shipping</span>
          <span className="text-navy font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-teal">
          <span>Tax</span>
          <span className="text-navy font-medium">${tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-teal">
            <span>Discount</span>
            <span className="font-medium text-red-500">−${discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-skyblue mt-4 pt-4 flex justify-between items-baseline">
        <span className="font-semibold text-navy">Total</span>
        <span className="text-2xl font-bold text-navy">${total.toFixed(2)}</span>
      </div>

      <button
        onClick={onCheckout}
        disabled={disabled}
        className="mt-6 w-full bg-navy text-white font-bold py-3.5 rounded-xl hover:bg-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {checkoutLabel}
      </button>
    </div>
  );
}

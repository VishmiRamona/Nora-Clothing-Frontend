import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartItemCard({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-skyblue/60 p-4">
      <img
        src={item.imageUrl || item.image || '/placeholder.jpg'}
        alt={item.name}
        className="w-20 h-20 rounded-xl object-cover bg-beige flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-navy truncate">{item.name}</h3>
        <p className="text-teal text-sm mt-0.5">${item.price.toFixed(2)} each</p>
      </div>

      <div className="flex items-center border border-skyblue rounded-lg overflow-hidden flex-shrink-0">
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          className="p-2 hover:bg-beige text-navy"
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span className="px-4 text-sm font-semibold text-navy">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          className="p-2 hover:bg-beige text-navy"
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      <p className="w-20 text-right font-bold text-navy flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>

      <button
        onClick={() => onRemove(item.productId)}
        aria-label="Remove item"
        className="p-2 rounded-full text-teal hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

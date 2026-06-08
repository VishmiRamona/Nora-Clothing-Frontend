import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';

export default function ProductDetailModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { user } = useUser();
  const { showToast } = useToast();
  const [selectedSize, setSelectedSize] = useState('M');
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleAddToCart = () => {
    if (!user) {
      showToast('Please login to add items to your cart', 'warning');
      return;
    }
    addToCart(product, 1);
    showToast(`${product.name} added to cart!`, 'success');
    onClose();
  };

  const renderBulletPoints = (text) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim());
    return (
      <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
        {lines.map((line, i) => <li key={i}>{line.replace(/^-\s*/, '')}</li>)}
      </ul>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex flex-col md:flex-row">
            {/* Image column */}
            <div className="md:w-1/2 bg-gray-100 p-6 flex items-center justify-center">
              <img src={product.images?.[0] || product.imageUrl} alt={product.name} className="w-full h-auto object-contain max-h-96 rounded-lg" />
            </div>
            {/* Details column */}
            <div className="md:w-1/2 p-6 flex flex-col">
              <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
              {product.keywords && (
                <p className="text-gray-500 text-sm mt-1">{product.keywords}</p>
              )}
              <p className="text-primary text-2xl font-bold mt-2">${product.price}</p>
              
              <div className="mt-4 border-t pt-3">
                <p className="text-gray-700">{product.description || 'No description available.'}</p>
              </div>

              {product.details && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800">Details</h3>
                  {renderBulletPoints(product.details)}
                </div>
              )}
              
              {product.fabricCare && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800">Fabric & Care</h3>
                  <p className="text-gray-600 text-sm">{product.fabricCare}</p>
                </div>
              )}
              
              {product.sizeFit && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800">Size & Fit</h3>
                  <p className="text-gray-600 text-sm">{product.sizeFit}</p>
                </div>
              )}

              <div className="mt-4">
                <h3 className="font-semibold text-gray-800">Select Size</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 border rounded-md transition ${
                        selectedSize === size 
                          ? 'bg-primary text-white border-primary' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="mt-6 w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
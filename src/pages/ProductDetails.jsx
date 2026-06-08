import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Star, Minus, Plus } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useUser();
  const { showToast } = useToast();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('description');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/products/${id}`).then(res => {
      setProduct(res.data);
      setActiveImage(0);
      setSelectedColor(res.data.colors?.[0] || null);
      setSelectedSize((res.data.sizes?.length ? res.data.sizes : DEFAULT_SIZES)[0] || null);
      setQuantity(1);
    }).catch(() => showToast('Could not load product', 'error'));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    api.get(`/products?category=${encodeURIComponent(product.category)}`)
      .then(res => setRelated(res.data.filter(p => p._id !== product._id).slice(0, 4)))
      .catch(() => {});
  }, [product]);

  if (!product) {
    return <div className="container mx-auto py-24 text-center text-teal">Loading product…</div>;
  }

  const images = product.images?.length ? product.images : [product.imageUrl || '/placeholder.jpg'];
  const sizes = product.sizes?.length ? product.sizes : DEFAULT_SIZES;
  const rating = product.rating ?? 4.5;
  const wishlisted = isWishlisted(product._id);

  const requireLogin = (action) => {
    if (!user) {
      showToast('Please login to continue', 'warning');
      return;
    }
    action();
  };

  const handleAddToCart = () => requireLogin(() => {
    addToCart(product, quantity);
    showToast(`${product.name} added to cart!`, 'success');
  });

  const handleBuyNow = () => requireLogin(() => {
    addToCart(product, quantity);
    navigate('/cart');
  });

  const handleWishlist = () => requireLogin(() => {
    const added = toggleWishlist(product);
    if (added) showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'success');
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <p className="text-sm text-teal mb-6">
        <Link to="/features" className="hover:text-navy">Shop</Link> / <span className="text-navy">{product.category}</span> / <span className="text-navy">{product.name}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-beige border border-skyblue/60">
            <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-navy' : 'border-skyblue/60'}`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: details */}
        <div>
          <p className="text-teal text-xs font-semibold uppercase tracking-wide">{product.category}</p>
          <h1 className="text-3xl font-bold text-navy mt-1">{product.name}</h1>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className={i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-skyblue'} />
              ))}
            </div>
            <span className="text-sm text-teal">{rating.toFixed(1)} ({product.reviewCount ?? 0} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mt-4">
            <p className="text-3xl font-bold text-navy">${product.price}</p>
            {product.oldPrice && <p className="text-lg text-teal/70 line-through">${product.oldPrice}</p>}
          </div>

          <p className="text-teal mt-4 leading-relaxed">{product.description || 'No description available.'}</p>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-navy text-sm mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                    style={{ backgroundColor: color }}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === color ? 'border-navy scale-110' : 'border-skyblue/60'}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          <div className="mt-6">
            <h3 className="font-semibold text-navy text-sm mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedSize === size ? 'bg-navy text-white border-navy' : 'border-skyblue text-navy hover:border-navy'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <h3 className="font-semibold text-navy text-sm mb-2">Quantity</h3>
            <div className="inline-flex items-center border border-skyblue rounded-lg overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2.5 hover:bg-beige text-navy" aria-label="Decrease quantity">
                <Minus size={16} />
              </button>
              <span className="px-5 font-semibold text-navy">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="p-2.5 hover:bg-beige text-navy" aria-label="Increase quantity">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button onClick={handleAddToCart} className="flex-1 bg-navy text-white font-bold py-3.5 rounded-xl hover:bg-teal transition-colors">
              Add To Cart
            </button>
            <button onClick={handleBuyNow} className="flex-1 bg-skyblue text-navy font-bold py-3.5 rounded-xl hover:bg-teal hover:text-white transition-colors">
              Buy Now
            </button>
            <button
              onClick={handleWishlist}
              aria-label="Toggle wishlist"
              className="px-5 py-3.5 rounded-xl border border-skyblue hover:border-navy transition-colors"
            >
              <Heart size={20} className={wishlisted ? 'fill-navy text-navy' : 'text-navy'} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="flex gap-8 border-b border-skyblue">
          {['description', 'reviews'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 capitalize font-semibold transition-colors ${tab === t ? 'text-navy border-b-2 border-navy' : 'text-teal'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="py-6 text-teal leading-relaxed">
          {tab === 'description' && (
            <div className="space-y-3 max-w-3xl">
              <p>{product.description || 'No description available.'}</p>
              {product.details && <p className="whitespace-pre-line">{product.details}</p>}
              {product.fabricCare && <p><span className="font-semibold text-navy">Fabric & Care: </span>{product.fabricCare}</p>}
              {product.sizeFit && <p><span className="font-semibold text-navy">Size & Fit: </span>{product.sizeFit}</p>}
            </div>
          )}
          {tab === 'reviews' && (
            <p>No reviews yet. Be the first to review <span className="font-semibold text-navy">{product.name}</span>.</p>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-navy mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => (
              <ProductCard key={p._id} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </div>
      )}

      {quickViewProduct && (
        <ProductDetailModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}

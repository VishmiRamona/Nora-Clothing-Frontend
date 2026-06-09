import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { useCart } from '../../contexts/CartContext';
import { useUser } from '../../contexts/UserContext';
import { useToast } from '../../contexts/ToastContext';

import 'swiper/css';
import 'swiper/css/navigation';

function StarRating({ rating = 4.5 }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" fill={i <= Math.round(rating) ? 'currentColor' : '#C8D9E6'} className="w-4 h-4">
          <path d="M10 1l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3-5.4 3 1.3-6L1.3 7.2l6.1-.6L10 1z" />
        </svg>
      ))}
      <span className="text-navy/60 text-xs ml-1">{rating}</span>
    </div>
  );
}

function BestSellerCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useUser();
  const { showToast } = useToast();
  const [wishlisted, setWishlisted] = useState(false);

  const image = product.images?.[0] || product.imageUrl || '/placeholder.jpg';

  const handleAddToCart = () => {
    if (!user) {
      showToast('Please login to add items to your cart', 'warning');
      return;
    }
    addToCart(product, 1);
    showToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 border border-skyblue/40 h-full flex flex-col">
      <div className="relative h-72 overflow-hidden bg-skyblue/20">
        <img src={image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <button
          onClick={() => setWishlisted((w) => !w)}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors ${
            wishlisted ? 'bg-rose-500 text-white' : 'bg-white/90 text-navy hover:bg-white'
          }`}
          aria-label="Toggle wishlist"
        >
          <svg className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 010-6.364z" />
          </svg>
        </button>
        {product.isNewArrival && (
          <span className="absolute top-4 left-4 bg-navy text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow">
            New Arrivals
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-navy text-lg truncate">{product.name}</h3>
        <div className="mt-1.5"><StarRating rating={product.rating || 4.5} /></div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-teal font-bold text-xl">${product.price}</p>
          <button
            onClick={handleAddToCart}
            className="bg-navy text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-teal transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 18v3" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BestSellers({ products = [] }) {
  if (!products.length) return null;

  return (
    <section id="new-arrivals" className="container mx-auto px-4 py-16 md:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
        <div>
          <span className="uppercase tracking-[0.2em] text-xs md:text-sm font-semibold text-teal">Newly Launched</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2">New Arrivals</h2>
        </div>
        <Link to="/features" className="text-navy font-semibold hover:text-teal transition-colors">
          View Collection →
        </Link>
      </div>

      <div className="relative best-sellers-swiper">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{ nextEl: '.bs-next', prevEl: '.bs-prev' }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="!pb-2"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id}>
              <BestSellerCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="bs-prev absolute top-1/2 -left-3 md:-left-5 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-skyblue/50 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="bs-next absolute top-1/2 -right-3 md:-right-5 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-skyblue/50 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}

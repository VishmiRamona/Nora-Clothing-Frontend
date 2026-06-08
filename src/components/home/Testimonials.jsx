import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Amelia Carter',
    image: '/images/dress1.png',
    rating: 5,
    review: "The quality completely exceeded my expectations. Every piece feels like it was tailored just for me — this is my new go-to store.",
  },
  {
    name: 'Sophia Bennett',
    image: '/images/dress2.png',
    rating: 5,
    review: "Fast shipping, beautiful packaging, and the fit was perfect. I've already recommended Nora to all my friends.",
  },
  {
    name: 'Olivia Hayes',
    image: '/images/dress3.png',
    rating: 4,
    review: "Elegant designs that actually photograph as well as they look in person. Customer support was lovely too.",
  },
  {
    name: 'Grace Whitfield',
    image: '/images/dress4.png',
    rating: 5,
    review: "I love how every collection feels timeless rather than trendy. These are pieces I'll keep wearing for years.",
  },
];

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5 text-amber-400 mb-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" fill={i <= rating ? 'currentColor' : '#C8D9E6'} className="w-4 h-4">
          <path d="M10 1l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3-5.4 3 1.3-6L1.3 7.2l6.1-.6L10 1z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-skyblue/30 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="uppercase tracking-[0.2em] text-xs md:text-sm font-semibold text-teal">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2">What Our Customers Say</h2>
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true, el: '.testimonial-pagination' }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1280: { slidesPerView: 3 },
          }}
          className="!pb-2"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.name}>
              <div className="bg-white rounded-3xl shadow-md p-6 md:p-8 h-full flex flex-col">
                <StarRow rating={t.rating} />
                <p className="text-navy/70 italic leading-relaxed flex-1">"{t.review}"</p>
                <div className="flex items-center gap-3 mt-6">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-skyblue" />
                  <div>
                    <p className="font-bold text-navy">{t.name}</p>
                    <p className="text-xs text-navy/50">Verified Buyer</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="testimonial-pagination flex justify-center gap-2 mt-8" />
      </div>
    </section>
  );
}

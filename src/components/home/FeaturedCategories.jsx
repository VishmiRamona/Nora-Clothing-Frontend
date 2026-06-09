import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Dresses', count: '80+ Products', image: '/images/dress1.png', query: 'casual' },
  { name: 'Outerwear', count: '60+ Products', image: '/images/dress2.png', query: 'blazers' },
  { name: 'Tops', count: '100+ Products', image: '/images/dress3.png', query: 'blouses' },
  { name: 'Bottoms', count: '70+ Products', image: '/images/dress4.png', query: 'jeans' },
  { name: 'Accessories', count: '50+ Products', image: '/images/dress1.png', query: 'bags' },
];

export default function FeaturedCategories() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 md:mb-14"
      >
        <span className="uppercase tracking-[0.2em] text-xs md:text-sm font-semibold text-teal">
          Shop by Category
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2">Featured Collections</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 h-80"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-1">{cat.name}</h3>
              <p className="text-sm text-skyblue/90 mb-4">{cat.count}</p>
              <Link
                to={`/features?category=${cat.query}`}
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:text-navy"
              >
                Shop Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

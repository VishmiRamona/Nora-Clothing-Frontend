import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const heroImage = '/images/hero1.jpg';

const stats = [
  { label: 'Customers', value: '50K+' },
  { label: 'Products', value: '500+' },
  { label: 'Rating', value: '4.9★' },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-beige">
      {/* Soft gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-skyblue/40 via-beige to-beige" />
      <div className="absolute -top-24 -right-24 w-72 h-72 md:w-96 md:h-96 bg-teal/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-20 w-72 h-72 md:w-96 md:h-96 bg-navy/10 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10 px-4 py-16 md:py-24 lg:py-28">
        {/* TWO CHANGES: gap-8 → gap-4, and remove lg:justify-end */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          {/* Left side - unchanged */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <span className="inline-block uppercase tracking-[0.2em] text-xs md:text-sm font-semibold text-teal bg-skyblue/60 px-4 py-2 rounded-full mb-6">
              The New Season Edit
            </span>
            <h1 className="font-bold text-navy leading-tight text-4xl sm:text-5xl lg:text-6xl mb-6">
              Elevate Your Everyday <span className="text-teal">Elegance</span>
            </h1>
            <p className="text-base md:text-lg text-navy/70 max-w-xl mx-auto lg:mx-0 mb-8">
              Discover timeless silhouettes and premium fabrics, curated for those who
              believe style is a quiet kind of confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/features"
                  className="inline-block bg-navy text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-navy/20 hover:bg-teal transition-colors"
                >
                  Shop Now
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/features"
                  className="inline-block border-2 border-navy text-navy px-8 py-3.5 rounded-full font-semibold hover:bg-navy hover:text-white transition-colors"
                >
                  Explore Collection
                </Link>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto lg:mx-0">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="text-center lg:text-left"
                >
                  <p className="text-2xl md:text-3xl font-bold text-navy">{stat.value}</p>
                  <p className="text-xs md:text-sm text-navy/60">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - changed: removed lg:justify-end so image aligns left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative flex justify-center lg:justify-start"
          >
            <div className="relative w-72 sm:w-80 md:w-[26rem]">
              <div className="absolute inset-6 bg-gradient-to-tr from-teal/30 to-skyblue/50 rounded-[2.5rem] blur-2xl" />
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={heroImage}
                  alt="Featured fashion model"
                  className="w-full h-[26rem] sm:h-[30rem] md:h-[34rem] object-cover"
                />
              </div>

              {/* Floating Sale badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: [0, -8, 0] }}
                transition={{ delay: 0.6, duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -left-4 sm:-left-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse" />
                <div>
                  <p className="text-xs text-navy/60 leading-none">Up to</p>
                  <p className="text-lg font-bold text-navy leading-none">30% OFF</p>
                </div>
              </motion.div>

              {/* Floating Trending badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: [0, 8, 0] }}
                transition={{ delay: 0.9, duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -right-2 sm:-right-8 bg-navy text-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2"
              >
                <svg className="w-5 h-5 text-skyblue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div>
                  <p className="text-xs text-skyblue/80 leading-none">Trending</p>
                  <p className="text-sm font-semibold leading-none">This Week</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
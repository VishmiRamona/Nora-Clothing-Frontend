import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function useCountdown(hoursFromNow) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date();
    target.setHours(target.getHours() + hoursFromNow);

    const tick = () => {
      const diff = Math.max(0, target - new Date());
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [hoursFromNow]);

  return timeLeft;
}

function OfferCard({ offer, delay }) {
  const time = useCountdown(offer.hours);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-3xl overflow-hidden border border-white/30 bg-white/10 backdrop-blur-xl shadow-xl p-6 md:p-7 flex flex-col h-full"
    >
      <span className="absolute top-5 right-5 bg-white text-navy text-xs font-bold px-3 py-1.5 rounded-full shadow">
        {offer.discount}
      </span>

      <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{offer.title}</h3>
      <p className="text-skyblue/90 text-sm mb-6">{offer.description}</p>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { label: 'Days', value: time.d },
          { label: 'Hrs', value: time.h },
          { label: 'Min', value: time.m },
          { label: 'Sec', value: time.s },
        ].map((unit) => (
          <div key={unit.label} className="bg-white/15 rounded-xl py-2 text-center border border-white/20">
            <p className="text-lg md:text-xl font-bold text-white leading-none">
              {String(unit.value).padStart(2, '0')}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-skyblue/80 mt-1">{unit.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 flex-wrap">
        <div className="bg-white/15 border border-dashed border-white/40 rounded-lg px-4 py-2">
          <p className="text-[10px] uppercase text-skyblue/70 leading-none mb-1">Coupon Code</p>
          <p className="font-mono font-bold text-white tracking-widest">{offer.code}</p>
        </div>
        <Link
          to="/features"
          className="bg-white text-navy font-semibold px-5 py-2.5 rounded-full hover:bg-skyblue transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </motion.div>
  );
}

const offers = [
  {
    title: 'Flash Sale',
    description: 'Limited-time picks across new season styles.',
    discount: 'Up to 40% Off',
    code: 'FLASH40',
    hours: 18,
  },
  {
    title: 'Weekend Sale',
    description: 'Refresh your wardrobe before the week begins.',
    discount: 'Up to 25% Off',
    code: 'WEEKEND25',
    hours: 64,
  },
  {
    title: 'New User Offer',
    description: 'A welcome gift on your very first order with us.',
    discount: '15% Off',
    code: 'WELCOME15',
    hours: 240,
  },
];

export default function ExclusiveOffers() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-teal to-navy" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-skyblue/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="uppercase tracking-[0.2em] text-xs md:text-sm font-semibold text-skyblue">
            Don't Miss Out
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Exclusive Offers</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer, i) => (
            <OfferCard key={offer.title} offer={offer} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

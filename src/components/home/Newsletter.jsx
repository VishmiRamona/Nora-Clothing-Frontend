import { useState } from 'react';
import { motion } from 'framer-motion';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // null | 'error' | 'success'
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('success');
    setMessage("You're subscribed! Watch your inbox for exclusive drops.");
    setEmail('');
  };

  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-navy px-6 py-12 md:px-16 md:py-16 text-center"
      >
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-teal/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-16 w-56 h-56 bg-skyblue/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-xl mx-auto">
          <span className="uppercase tracking-[0.2em] text-xs md:text-sm font-semibold text-skyblue">
            Stay in the Loop
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-2 mb-3">
            Join Our Newsletter
          </h2>
          <p className="text-skyblue/80 mb-8">
            Be the first to know about new arrivals, exclusive offers, and style edits — straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              id="newsletter-email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus(null); }}
              placeholder="Enter your email address"
              aria-label="Email address"
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-skyblue transition-colors"
            />
            <button
              type="submit"
              className="bg-white text-navy font-semibold px-7 py-3.5 rounded-full hover:bg-skyblue transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>

          {message && (
            <p className={`mt-4 text-sm font-medium ${status === 'error' ? 'text-rose-300' : 'text-emerald-300'}`}>
              {message}
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}

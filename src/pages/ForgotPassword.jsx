import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api.post('/users/forgot-password', { email });
      setMessage(res.data.message);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-xl p-8"
      >
        <div className="text-center mb-6">
          <Link to="/">
            <img src="/images/logo.png" alt="NORA" className="h-12 mx-auto" />
          </Link>
          <h2 className="text-2xl font-bold text-navy mt-4">Forgot Password</h2>
          <p className="text-sm text-gray-500 mt-1">Enter your email to receive a reset link.</p>
        </div>

        {message && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm mb-4 border border-green-200">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-skyblue rounded-xl px-4 py-3 text-sm text-navy outline-none focus:border-teal transition-colors"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal text-white py-3 rounded-xl font-semibold hover:bg-teal/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/auth" className="text-sm text-teal hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
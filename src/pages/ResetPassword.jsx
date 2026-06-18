import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api.post('/users/reset-password', { token, newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate('/auth'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired link');
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
          <h2 className="text-2xl font-bold text-navy mt-4">Reset Password</h2>
          <p className="text-sm text-gray-500 mt-1">Enter your new password below.</p>
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
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-skyblue rounded-xl px-4 py-3 text-sm text-navy outline-none focus:border-teal transition-colors pr-12"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <img
                src={showPassword ? '/icons/hide-pwd.png' : '/icons/show-pwd.png'}
                alt={showPassword ? 'Hide' : 'Show'}
                className="w-5 h-5"
              />
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-skyblue rounded-xl px-4 py-3 text-sm text-navy outline-none focus:border-teal transition-colors"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal text-white py-3 rounded-xl font-semibold hover:bg-teal/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
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
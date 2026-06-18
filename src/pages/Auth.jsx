import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login: userLogin } = useUser();
  const { login: adminLogin } = useAdminAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Password visibility toggles (icon only)
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    showToast('Password reset isn\'t available yet — please contact support for help signing in.', 'info');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    const adminResult = await adminLogin(email, password);
    if (adminResult.success) {
      navigate('/admin/dashboard');
      return;
    }

    try {
      const res = await api.post('/users/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('userToken', res.data.token);
        await userLogin(res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/users/register', { name, email, password });
      if (res.data.token) {
        localStorage.setItem('userToken', res.data.token);
        await userLogin(res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed');
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Column – Sign In */}
          <div className={`flex-1 p-8 md:p-12 ${isSignIn ? 'bg-gray-50' : 'bg-teal text-white'}`}>
            {isSignIn ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>
                <p className="text-gray-500 mb-4">or use your email password</p>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSignIn} className="space-y-4">
                  <input
                    type="email"
                    id="signin-email"
                    name="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                    required
                  />
                  <div className="relative">
                    <input
                      type={showSignInPassword ? 'text' : 'password'}
                      id="signin-password"
                      name="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      aria-label={showSignInPassword ? 'Hide password' : 'Show password'}
                    >
                      <img
                        src={showSignInPassword ? '/icons/hide-pwd.png' : '/icons/show-pwd.png'}
                        alt={showSignInPassword ? 'Hide' : 'Show'}
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                  <div className="text-right">
                    {/* <button type="button" onClick={handleForgotPassword} className="text-sm text-primary hover:underline">Forgot Your Password?</button> */}
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-opacity-90 transition">
                    SIGN IN
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col justify-center h-full text-center">
                <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
                <p className="mb-6">To keep connected with us please login with your personal info.</p>
                <button onClick={() => setIsSignIn(true)} className="bg-transparent border-2 border-white text-white px-6 py-2 rounded hover:bg-white hover:text-teal transition self-center">
                  SIGN IN
                </button>
              </div>
            )}
          </div>

          {/* Right Column – Sign Up */}
          <div className={`flex-1 p-8 md:p-12 ${!isSignIn ? 'bg-gray-50' : 'bg-teal text-white'}`}>
            {!isSignIn ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
                <p className="text-gray-500 mb-6">Enter your personal details to start your journey with us.</p>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSignUp} className="space-y-4">
                  <input
                    type="text"
                    id="signup-name"
                    name="name"
                    placeholder="Full Name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                    required
                  />
                  <input
                    type="email"
                    id="signup-email"
                    name="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                    required
                  />
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      id="signup-password"
                      name="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      aria-label={showSignUpPassword ? 'Hide password' : 'Show password'}
                    >
                      <img
                        src={showSignUpPassword ? '/icons/hide-pwd.png' : '/icons/show-pwd.png'}
                        alt={showSignUpPassword ? 'Hide' : 'Show'}
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-opacity-90 transition">
                    SIGN UP
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col justify-center h-full text-center">
                <h2 className="text-2xl font-bold mb-2">Hello, Friend!</h2>
                <p className="mb-6">Register with your personal details to use all site features.</p>
                <button onClick={() => setIsSignIn(false)} className="bg-transparent border-2 border-white text-white px-6 py-2 rounded hover:bg-white hover:text-teal transition self-center">
                  SIGN UP
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { UserProvider } from './contexts/UserContext';
import { ToastProvider } from './contexts/ToastContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <UserProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </UserProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
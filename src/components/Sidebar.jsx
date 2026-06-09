import { Link } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose, scrollToSection }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 font-sansita">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-4">
        <button onClick={onClose} className="text-xl mb-4">✕</button>
        <ul className="space-y-2">
          <li><Link to="/" onClick={onClose} className="block py-2 px-3 hover:bg-gray-100 rounded">Home</Link></li>
          <li><Link to="/features" onClick={onClose} className="block py-2 px-3 hover:bg-gray-100 rounded">Features</Link></li>
          <li>
            <button onClick={() => { scrollToSection('best-sellers'); onClose(); }} className="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded">
              Best Sellers
            </button>
          </li>
          <li>
            <button onClick={() => { scrollToSection('new-arrivals'); onClose(); }} className="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded">
              New Arrivals
            </button>
          </li>
          <li><Link to="/contact" onClick={onClose} className="block py-2 px-3 hover:bg-gray-100 rounded">Contact</Link></li>
          <li className="border-t border-gray-200 mt-2 pt-2"></li>
          <li><Link to="/login" onClick={onClose} className="block py-2 px-3 hover:bg-gray-100 rounded">Login</Link></li>
          <li><Link to="/register" onClick={onClose} className="block py-2 px-3 hover:bg-gray-100 rounded">Register</Link></li>
        </ul>
      </div>
    </div>
  );
}
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import api from '../services/api';
import useDebounce from '../hooks/useDebounce';

export default function SearchBar() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const term = debouncedQuery.trim();
    if (!term) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    api.get(`/products?search=${encodeURIComponent(term)}`)
      .then(res => {
        setResults(res.data.slice(0, 6));
        setSearched(true);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const goToProduct = (id) => {
    setOpen(false);
    setQuery('');
    navigate(`/product/${id}`);
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative">
      <div className={`flex items-center gap-2 bg-white/95 rounded-full px-3 py-1.5 transition-all duration-200 ${open ? 'w-64 shadow-md' : 'w-9'}`}>
        <button onClick={() => setOpen(o => !o)} aria-label="Toggle search" className="text-navy flex-shrink-0">
          {open ? <X size={18} /> : <Search size={18} />}
        </button>
        {open && (
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories, brands…"
            className="flex-1 bg-transparent outline-none text-sm text-navy placeholder:text-teal/60"
          />
        )}
      </div>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-skyblue/60 overflow-hidden z-50">
          {loading && (
            <div className="flex items-center gap-2 px-4 py-4 text-teal text-sm">
              <Loader2 size={16} className="animate-spin" /> Searching…
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-teal">
              No products found for <span className="font-semibold text-navy">"{query}"</span>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="max-h-96 overflow-y-auto divide-y divide-skyblue/40">
              {results.map(product => (
                <li key={product._id}>
                  <button
                    onClick={() => goToProduct(product._id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-beige transition-colors text-left"
                  >
                    <img
                      src={product.images?.[0] || product.imageUrl || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-skyblue/30"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy truncate">{product.name}</p>
                      <p className="text-xs text-teal truncate">{product.category}{product.brand ? ` · ${product.brand}` : ''}</p>
                    </div>
                    <span className="ml-auto text-sm font-bold text-navy flex-shrink-0">${product.price}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

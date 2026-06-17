import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import FilterPanel from '../components/FilterPanel';
import FilterDrawer from '../components/FilterDrawer';

const EMPTY_FILTERS = {
  minPrice: '', maxPrice: '', categories: [], brands: [], colors: [], sizes: [], minRating: null, inStockOnly: false
};

// Categories with subcategories (same as navbar)
const categories = [
  {
    name: 'Dresses',
    items: ['Casual Dresses', 'Maxi Dresses', 'Mini Dresses', 'Office Dresses', 'Party Dresses']
  },
  {
    name: 'Outerwear',
    items: ['Blazers', 'Cardigans', 'Coats', 'Hoodies', 'Jackets']
  },
  {
    name: 'Tops',
    items: ['Blouses', 'Crop Tops', 'Shirts', 'Tank Tops', 'T-Shirts']
  },
  {
    name: 'Bottoms',
    items: ['Jeans', 'Leggings', 'Shorts', 'Skirts', 'Trousers']
  },
  {
    name: 'Accessories',
    items: ['Bags', 'Belts', 'Jewelry', 'Sunglasses', 'Watches']
  }
];

// Map URL parameter (e.g., "mini") to full subcategory name
const categoryMappingFromParam = {
  casual: 'Casual Dresses', maxi: 'Maxi Dresses', mini: 'Mini Dresses', office: 'Office Dresses', party: 'Party Dresses',
  blazers: 'Blazers', cardigans: 'Cardigans', coats: 'Coats', hoodies: 'Hoodies', jackets: 'Jackets',
  blouses: 'Blouses', 'crop tops': 'Crop Tops', shirts: 'Shirts', 'tank tops': 'Tank Tops', 't-shirts': 'T-Shirts',
  jeans: 'Jeans', leggings: 'Leggings', shorts: 'Shorts', skirts: 'Skirts', trousers: 'Trousers',
  bags: 'Bags', belts: 'Belts', jewelry: 'Jewelry', sunglasses: 'Sunglasses', watches: 'Watches'
};

// Reverse mapping: full name → param key
const reverseMapping = Object.fromEntries(
  Object.entries(categoryMappingFromParam).map(([key, value]) => [value, key])
);

export default function Features() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Derive current subcategory from URL, default to 'Casual Dresses'
  const currentSubcategory = categoryParam && categoryMappingFromParam[categoryParam.toLowerCase()]
    ? categoryMappingFromParam[categoryParam.toLowerCase()]
    : 'Casual Dresses';

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Auto‑open parent category that contains current subcategory
  const [openCategories, setOpenCategories] = useState(() => {
    const parent = categories.find(cat => cat.items.includes(currentSubcategory));
    return parent ? { [parent.name]: true } : {};
  });

  // Fetch products whenever currentSubcategory changes
  useEffect(() => {
    api.get(`/products?category=${encodeURIComponent(currentSubcategory)}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, [currentSubcategory]);

  // Keep parent category open when URL changes
  useEffect(() => {
    const parent = categories.find(cat => cat.items.includes(currentSubcategory));
    if (parent) {
      setOpenCategories(prev => ({ ...prev, [parent.name]: true }));
    }
  }, [currentSubcategory]);

  const toggleCategory = (catName) => {
    setOpenCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  // When a subcategory is clicked, update the URL (not local state)
  const handleSubcategoryClick = (subcat) => {
    const paramKey = reverseMapping[subcat];
    if (paramKey) {
      setSearchParams({ category: paramKey });
    } else {
      // fallback: clear param (or set default)
      setSearchParams({});
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const facets = useMemo(() => ({
    categories: [...new Set(products.map(p => p.category).filter(Boolean))],
    brands: [...new Set(products.map(p => p.brand).filter(Boolean))],
    colors: [...new Set(products.flatMap(p => p.colors || []))],
    sizes: [...new Set(products.flatMap(p => p.sizes || []))],
  }), [products]);

  const filteredProducts = useMemo(() => products.filter(p => {
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
    if (filters.categories?.length && !filters.categories.includes(p.category)) return false;
    if (filters.brands?.length && !filters.brands.includes(p.brand)) return false;
    if (filters.colors?.length && !(p.colors || []).some(c => filters.colors.includes(c))) return false;
    if (filters.sizes?.length && !(p.sizes || []).some(s => filters.sizes.includes(s))) return false;
    if (filters.minRating && (p.rating ?? 0) < filters.minRating) return false;
    if (filters.inStockOnly && p.inStock === false) return false;
    return true;
  }), [products, filters]);

  const filterProps = { facets, filters, onChange: setFilters, onReset: () => setFilters(EMPTY_FILTERS) };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar (desktop) */}
        <div className="hidden lg:block lg:w-72 flex-shrink-0 space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4 border-b border-skyblue pb-2 text-navy">Shop by Category</h2>
            {categories.map((cat) => (
              <div key={cat.name} className="mb-3">
                <button
                  onClick={() => toggleCategory(cat.name)}
                  className="w-full text-left font-semibold py-2 px-3 rounded hover:bg-beige flex justify-between items-center text-navy"
                >
                  {cat.name}
                  <span className="text-teal">{openCategories[cat.name] ? '−' : '+'}</span>
                </button>
                {openCategories[cat.name] && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {cat.items.map((item) => (
                      <li key={item}>
                        <button
                          onClick={() => handleSubcategoryClick(item)}
                          className={`w-full text-left py-1 px-3 rounded text-sm transition-colors ${
                            currentSubcategory === item
                              ? 'bg-navy text-white'
                              : 'hover:bg-beige text-teal'
                          }`}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-skyblue pt-6">
            <FilterPanel {...filterProps} />
          </div>
        </div>

        {/* Mobile category list */}
        <div className="lg:hidden">
          {categories.map((cat) => (
            <div key={cat.name} className="mb-3">
              <button
                onClick={() => toggleCategory(cat.name)}
                className="w-full text-left font-semibold py-2 px-3 rounded hover:bg-beige flex justify-between items-center text-navy"
              >
                {cat.name}
                <span className="text-teal">{openCategories[cat.name] ? '−' : '+'}</span>
              </button>
              {openCategories[cat.name] && (
                <ul className="ml-4 mt-1 space-y-1">
                  {cat.items.map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => handleSubcategoryClick(item)}
                        className={`w-full text-left py-1 px-3 rounded text-sm transition-colors ${
                          currentSubcategory === item
                            ? 'bg-navy text-white'
                            : 'hover:bg-beige text-teal'
                        }`}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Right Content: Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-navy">{currentSubcategory}</h1>
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 border border-skyblue rounded-lg px-4 py-2 text-sm font-semibold text-navy hover:border-navy transition-colors"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} onQuickView={openProductModal} />
              ))
            ) : (
              <p className="col-span-full text-center text-teal py-10">
                {products.length > 0
                  ? 'No products match your filters. Try adjusting them.'
                  : `No products found in ${currentSubcategory}.`}
              </p>
            )}
          </div>
        </div>
      </div>

      <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} {...filterProps} />

      {/* Product Detail Modal */}
      {modalOpen && selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={closeModal} />
      )}
    </div>
  );
}
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

// Categories and subcategories (same as navbar)
const categories = [
  { name: 'Dresses', items: ['Casual Dresses', 'Maxi Dresses', 'Mini Dresses', 'Office Dresses', 'Party Dresses'] },
  { name: 'Outerwear', items: ['Blazers', 'Cardigans', 'Coats', 'Hoodies', 'Jackets'] },
  { name: 'Tops', items: ['Blouses', 'Crop Tops', 'Shirts', 'Tank Tops', 'T-Shirts'] },
  { name: 'Bottoms', items: ['Jeans', 'Leggings', 'Shorts', 'Skirts', 'Trousers'] },
  { name: 'Accessories', items: ['Bags', 'Belts', 'Jewelry', 'Sunglasses', 'Watches'] }
];

// Map URL param → either parent or subcategory
// Parent keys: dresses, outerwear, tops, bottoms, accessories
// Sub keys: casual, maxi, mini, ...
const paramMap = {
  // Parents
  dresses: { type: 'parent', value: 'Dresses' },
  outerwear: { type: 'parent', value: 'Outerwear' },
  tops: { type: 'parent', value: 'Tops' },
  bottoms: { type: 'parent', value: 'Bottoms' },
  accessories: { type: 'parent', value: 'Accessories' },
  // Subcategories (keep existing)
  casual: { type: 'sub', value: 'Casual Dresses' },
  maxi: { type: 'sub', value: 'Maxi Dresses' },
  mini: { type: 'sub', value: 'Mini Dresses' },
  office: { type: 'sub', value: 'Office Dresses' },
  party: { type: 'sub', value: 'Party Dresses' },
  blazers: { type: 'sub', value: 'Blazers' },
  cardigans: { type: 'sub', value: 'Cardigans' },
  coats: { type: 'sub', value: 'Coats' },
  hoodies: { type: 'sub', value: 'Hoodies' },
  jackets: { type: 'sub', value: 'Jackets' },
  blouses: { type: 'sub', value: 'Blouses' },
  'crop tops': { type: 'sub', value: 'Crop Tops' },
  shirts: { type: 'sub', value: 'Shirts' },
  'tank tops': { type: 'sub', value: 'Tank Tops' },
  't-shirts': { type: 'sub', value: 'T-Shirts' },
  jeans: { type: 'sub', value: 'Jeans' },
  leggings: { type: 'sub', value: 'Leggings' },
  shorts: { type: 'sub', value: 'Shorts' },
  skirts: { type: 'sub', value: 'Skirts' },
  trousers: { type: 'sub', value: 'Trousers' },
  bags: { type: 'sub', value: 'Bags' },
  belts: { type: 'sub', value: 'Belts' },
  jewelry: { type: 'sub', value: 'Jewelry' },
  sunglasses: { type: 'sub', value: 'Sunglasses' },
  watches: { type: 'sub', value: 'Watches' }
};

// Reverse mapping: full name → param key (for sidebar clicks)
const reverseMap = {};
Object.entries(paramMap).forEach(([key, val]) => {
  reverseMap[val.value] = key;
});

// Helper to get the display title
const getDisplayTitle = (param) => {
  if (!param) return 'Casual Dresses';
  const entry = paramMap[param.toLowerCase()];
  if (!entry) return 'Casual Dresses';
  return entry.value;
};

export default function Features() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const currentParam = categoryParam ? categoryParam.toLowerCase() : 'casual';

  const entry = paramMap[currentParam];
  const isParent = entry && entry.type === 'parent';
  const parentName = isParent ? entry.value : null;
  const subName = (!isParent && entry) ? entry.value : null;

  // Determine which subcategory to highlight in sidebar
  // If parent, pick the first subcategory of that parent
  let highlightedSub = subName;
  if (isParent) {
    const parentCat = categories.find(c => c.name === parentName);
    highlightedSub = parentCat ? parentCat.items[0] : 'Casual Dresses';
  } else {
    highlightedSub = subName || 'Casual Dresses';
  }

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Auto-open parent category
  const [openCategories, setOpenCategories] = useState(() => {
    let parent = null;
    if (isParent) {
      parent = categories.find(cat => cat.name === parentName);
    } else {
      parent = categories.find(cat => cat.items.includes(highlightedSub));
    }
    return parent ? { [parent.name]: true } : {};
  });

  // Fetch products based on param
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isParent) {
          // Fetch all products and filter by parent
          const res = await api.get('/products');
          setAllProducts(res.data);
          const parentCat = categories.find(c => c.name === parentName);
          const subItems = parentCat ? parentCat.items : [];
          const filtered = res.data.filter(p => {
            const productSub = p.subcategory || p.category; // adjust field name
            return subItems.includes(productSub);
          });
          setProducts(filtered);
        } else {
          // Fetch specific subcategory
          const res = await api.get(`/products?category=${encodeURIComponent(highlightedSub)}`);
          setProducts(res.data);
          setAllProducts([]);
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
    };
    fetchData();
  }, [currentParam, isParent, parentName, highlightedSub]);

  // Update open categories when param changes
  useEffect(() => {
    let parent = null;
    if (isParent) {
      parent = categories.find(cat => cat.name === parentName);
    } else {
      parent = categories.find(cat => cat.items.includes(highlightedSub));
    }
    if (parent) {
      setOpenCategories(prev => ({ ...prev, [parent.name]: true }));
    }
  }, [currentParam, isParent, parentName, highlightedSub]);

  const toggleCategory = (catName) => {
    setOpenCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  // When a subcategory is clicked, update URL
  const handleSubcategoryClick = (subcat) => {
    const paramKey = reverseMap[subcat];
    if (paramKey) {
      setSearchParams({ category: paramKey });
    } else {
      // fallback: try to find parent
      const parent = categories.find(cat => cat.items.includes(subcat));
      if (parent) {
        const parentKey = reverseMap[parent.name];
        if (parentKey) setSearchParams({ category: parentKey });
      }
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

  const displayTitle = getDisplayTitle(currentParam);

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
                            highlightedSub === item
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
                          highlightedSub === item
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
            <h1 className="text-2xl font-bold text-navy">{displayTitle}</h1>
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
                  : `No products found for ${displayTitle}.`}
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
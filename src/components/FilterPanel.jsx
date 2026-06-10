import { Star } from 'lucide-react';

const RATING_OPTIONS = [4, 3, 2, 1];

export default function FilterPanel({ facets, filters, onChange, onReset }) {
  const toggleInArray = (key, value) => {
    const current = filters[key] || [];
    const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-navy">Filters</h2>
        <button onClick={onReset} className="text-xs font-semibold text-teal hover:text-navy underline">
          Clear all
        </button>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-navy text-sm mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            id="filter-min-price"
            name="minPrice"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className="w-full border border-skyblue rounded-lg px-3 py-1.5 text-sm text-navy outline-none focus:border-navy"
          />
          <span className="text-teal">–</span>
          <input
            type="number"
            id="filter-max-price"
            name="maxPrice"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className="w-full border border-skyblue rounded-lg px-3 py-1.5 text-sm text-navy outline-none focus:border-navy"
          />
        </div>
      </div>

      {/* Categories */}
      {facets.categories?.length > 0 && (
        <div>
          <h3 className="font-semibold text-navy text-sm mb-3">Category</h3>
          <div className="space-y-1.5">
            {facets.categories.map(cat => (
              <label key={cat} className="flex items-center gap-2 text-sm text-teal cursor-pointer hover:text-navy">
                <input
                  type="checkbox"
                  checked={(filters.categories || []).includes(cat)}
                  onChange={() => toggleInArray('categories', cat)}
                  className="rounded border-skyblue text-navy focus:ring-navy"
                />
                {cat}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Brand */}
      {facets.brands?.length > 0 && (
        <div>
          <h3 className="font-semibold text-navy text-sm mb-3">Brand</h3>
          <div className="space-y-1.5">
            {facets.brands.map(brand => (
              <label key={brand} className="flex items-center gap-2 text-sm text-teal cursor-pointer hover:text-navy">
                <input
                  type="checkbox"
                  checked={(filters.brands || []).includes(brand)}
                  onChange={() => toggleInArray('brands', brand)}
                  className="rounded border-skyblue text-navy focus:ring-navy"
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Color */}
      {facets.colors?.length > 0 && (
        <div>
          <h3 className="font-semibold text-navy text-sm mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {facets.colors.map(color => (
              <button
                key={color}
                onClick={() => toggleInArray('colors', color)}
                aria-label={color}
                style={{ backgroundColor: color }}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  (filters.colors || []).includes(color) ? 'border-navy scale-110' : 'border-skyblue/60'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {facets.sizes?.length > 0 && (
        <div>
          <h3 className="font-semibold text-navy text-sm mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map(size => (
              <button
                key={size}
                onClick={() => toggleInArray('sizes', size)}
                className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors ${
                  (filters.sizes || []).includes(size) ? 'bg-navy text-white border-navy' : 'border-skyblue text-navy hover:border-navy'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-navy text-sm mb-3">Rating</h3>
        <div className="space-y-1.5">
          {RATING_OPTIONS.map(r => (
            <label key={r} className="flex items-center gap-2 text-sm text-teal cursor-pointer hover:text-navy">
              <input
                type="radio"
                name="minRating"
                checked={filters.minRating === r}
                onChange={() => onChange({ ...filters, minRating: filters.minRating === r ? null : r })}
                className="border-skyblue text-navy focus:ring-navy"
              />
              <span className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={i < r ? 'fill-amber-400 text-amber-400' : 'text-skyblue'} />
                ))}
                <span className="ml-1">& up</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-semibold text-navy text-sm mb-3">Availability</h3>
        <label className="flex items-center gap-2 text-sm text-teal cursor-pointer hover:text-navy">
          <input
            type="checkbox"
            checked={!!filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="rounded border-skyblue text-navy focus:ring-navy"
          />
          In stock only
        </label>
      </div>
    </div>
  );
}

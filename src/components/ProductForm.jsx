import { useEffect, useState } from 'react';

const ProductForm = ({ initialData, onSubmit, onCancel, uploading, categoryOptions }) => {
  const [formData, setFormData] = useState({
    name: '', price: '', category: '', images: [], description: '',
    keywords: '', details: '', fabricCare: '', sizeFit: '',
    isBestSeller: false, isNewArrival: false
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setEditingId(initialData._id);
      setImageFiles([]);
      setImagePreviews([]);
    } else {
      setFormData({
        name: '', price: '', category: '', images: [], description: '',
        keywords: '', details: '', fabricCare: '', sizeFit: '',
        isBestSeller: false, isNewArrival: false
      });
      setImageFiles([]);
      setImagePreviews([]);
      setEditingId(null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (index, file) => {
    if (!file) return;
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    newFiles[index] = file;
    newPreviews[index] = URL.createObjectURL(file);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    newFiles[index] = null;
    newPreviews[index] = null;
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, imageFiles);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border rounded px-3 py-2" required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="border rounded px-3 py-2" required />
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className="border rounded px-3 py-2 w-full" required>
            <option value="">Select a category</option>
            {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* Multiple Images (up to 4) */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-2">Product Images (up to 4)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0,1,2,3].map(idx => (
              <div key={idx} className="border rounded p-2 text-center">
                {imagePreviews[idx] ? (
                  <div className="relative">
                    <img src={imagePreviews[idx]} alt={`preview ${idx}`} className="h-24 w-full object-cover rounded mb-2" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs">✕</button>
                  </div>
                ) : formData.images[idx] ? (
                  <div className="relative">
                    <img src={formData.images[idx]} alt={`existing ${idx}`} className="h-24 w-full object-cover rounded mb-2" />
                    <button type="button" onClick={() => { const newUrls = [...formData.images]; newUrls[idx] = ''; setFormData({...formData, images: newUrls}); }} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs">✕</button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(idx, e.target.files[0])} />
                    <div className="h-24 bg-gray-100 flex items-center justify-center text-gray-500 text-sm rounded">+ Add Image</div>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        <textarea name="description" placeholder="Short Description" value={formData.description} onChange={handleChange} className="border rounded px-3 py-2 col-span-2" />
        <input type="text" name="keywords" placeholder="Keywords (comma separated)" value={formData.keywords} onChange={handleChange} className="border rounded px-3 py-2 col-span-2" />
        <textarea name="details" placeholder="Details (e.g., - Low-cut neckline\n- Mini Length)" value={formData.details} onChange={handleChange} className="border rounded px-3 py-2 col-span-2" />
        <textarea name="fabricCare" placeholder="Fabric & Care" value={formData.fabricCare} onChange={handleChange} className="border rounded px-3 py-2 col-span-2" />
        <textarea name="sizeFit" placeholder="Size & Fit" value={formData.sizeFit} onChange={handleChange} className="border rounded px-3 py-2 col-span-2" />
        
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} /> Best Seller
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} /> New Arrival
        </label>
      </div>
      <div className="mt-4 flex gap-2">
        <button type="submit" disabled={uploading} className="bg-primary text-white px-4 py-2 rounded">
          {uploading ? 'Uploading...' : (editingId ? 'Update' : 'Add')} Product
        </button>
        {editingId && (
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
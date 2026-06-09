import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useUser } from '../contexts/UserContext';
import api from '../services/api';
import axios from 'axios';
import ProductForm from '../components/ProductForm';
// Material Icons imports
import { MdDashboard, MdPeople, MdLocalMall, MdMessage, MdShoppingCart, MdLogout } from 'react-icons/md';

export default function AdminDashboard() {
  const { isAuthenticated, logout: adminLogout } = useAdminAuth();
  const { logout: userLogout } = useUser();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminTab') || 'dashboard');
  
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false); // NEW: control form visibility

  const categoryOptions = [
    'Casual Dresses', 'Maxi Dresses', 'Mini Dresses', 'Office Dresses', 'Party Dresses',
    'Blazers', 'Cardigans', 'Coats', 'Hoodies', 'Jackets',
    'Blouses', 'Crop Tops', 'Shirts', 'Tank Tops', 'T-Shirts',
    'Jeans', 'Leggings', 'Shorts', 'Skirts', 'Trousers',
    'Bags', 'Belts', 'Jewelry', 'Sunglasses', 'Watches'
  ];

  // Dashboard calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const productSold = products.length;
  const totalUsers = users.length;
  const recentOrders = [...orders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  
  const productSales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
    });
  });
  const topProducts = Object.entries(productSales).sort((a,b) => b[1] - a[1]).slice(0, 4).map(([name, qty]) => {
    const product = products.find(p => p.name === name);
    return { name, sales: qty, price: product?.price || 0 };
  });
  if (topProducts.length === 0 && products.length) {
    products.slice(0,4).forEach(p => topProducts.push({ name: p.name, sales: 0, price: p.price }));
  }
  
  const customerSpending = {};
  orders.forEach(order => {
    const name = order.customerName;
    customerSpending[name] = (customerSpending[name] || 0) + order.totalAmount;
  });
  const topCustomers = Object.entries(customerSpending).sort((a,b) => b[1] - a[1]).slice(0, 3).map(([name, total]) => ({ name, total }));

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [productsRes, contactsRes, ordersRes, usersRes] = await Promise.all([
        api.get('/products'),
        api.get('/admin/contacts'),
        api.get('/admin/orders'),
        api.get('/users').catch(() => ({ data: [] }))
      ]);
      setProducts(productsRes.data || []);
      setContacts(contactsRes.data || []);
      setOrders(ordersRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate('/auth');
    fetchAllData();
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('adminTab', activeTab);
  }, [activeTab]);

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
        params: { key: 'dc53620a11c364989a9ae6cec355ee59' },
      });
      return response.data.data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image. Please try again or use a URL directly.');
      return null;
    }
  };

  const handleProductSubmit = async (formData, imageFiles) => {
    setUploadingImages(true);
    let imageUrls = [...formData.images];
    for (let i = 0; i < imageFiles.length; i++) {
      if (imageFiles[i]) {
        const url = await uploadImageToImgBB(imageFiles[i]);
        if (url) imageUrls[i] = url;
      }
    }
    imageUrls = imageUrls.filter(url => url).slice(0, 4);
    const productData = { ...formData, images: imageUrls };
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, productData);
      } else {
        await api.post('/admin/products', productData);
      }
      setEditingProduct(null);
      setShowProductForm(false); // hide form after submit
      fetchAllData();
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    } finally {
      setUploadingImages(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      await api.delete(`/admin/products/${id}`);
      fetchAllData();
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true); // show form when editing
  };

  const handleLogout = () => {
    adminLogout();
    userLogout();
    navigate('/auth');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const goToTab = (tab) => { setActiveTab(tab); if (!sidebarOpen) setSidebarOpen(true); };

  // Creative Dashboard Card Component
  const DashboardCard = ({ title, value, icon, trend, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-skyblue group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-navy">{value}</p>
          {trend && <p className={`text-xs mt-2 ${trend.startsWith('+') ? 'text-teal' : 'text-red-500'}`}>{trend}</p>}
        </div>
        <div className="text-4xl opacity-80 group-hover:scale-110 transition-transform">{icon}</div>
      </div>
    </motion.div>
  );

  const RecentOrdersTable = () => (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-skyblue">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><span className="text-navy">📦</span> Recent Orders</h2>
        <button onClick={() => setActiveTab('orders')} className="text-navy text-sm hover:underline">View all →</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-skyblue">
              <th className="text-left py-3 font-semibold text-gray-500">Product</th>
              <th className="text-left py-3 font-semibold text-gray-500">Price</th>
              <th className="text-left py-3 font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr><td colSpan="3" className="py-4 text-center text-gray-400">No orders yet</td></tr>
            ) : (
              recentOrders.map(order => (
                <tr key={order._id} className="border-b border-skyblue hover:bg-gray-50 transition">
                  <td className="py-3">{order.items.map(i => i.name).join(', ')}</td>
                  <td className="py-3">${order.totalAmount}</td>
                  <td className="py-3"><span className="px-2 py-1 bg-teal/20 text-navy rounded-full text-xs font-medium">Delivered</span></td>
                 </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const EarningsChart = () => (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-skyblue">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="text-navy">📊</span> Earnings (weekly)</h2>
      <div className="text-3xl font-bold text-navy mb-2">${totalRevenue.toLocaleString()}</div>
      <div className="h-32 flex items-end gap-2 mt-4">
        {[40, 60, 30, 80, 50, 70, 45].map((height, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-teal rounded-t-lg hover:bg-navy transition-all"
            style={{ height: `${height}%` }}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
      </div>
    </div>
  );

  const TopCustomers = () => (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-skyblue">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="text-navy">👥</span> Top Customers</h2>
      {topCustomers.length === 0 ? (
        <p className="text-gray-400">No customers yet</p>
      ) : (
        topCustomers.map((cust, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex justify-between items-center border-b border-skyblue py-3 last:border-0"
          >
            <div>
              <p className="font-medium text-gray-800">{cust.name}</p>
              <p className="text-xs text-gray-500">Total spent: ${cust.total}</p>
            </div>
            <div className="bg-teal/20 text-navy px-2 py-1 rounded-full text-xs font-medium">✨ Top</div>
          </motion.div>
        ))
      )}
    </div>
  );

  const TopProductsGrid = () => (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-skyblue">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="text-navy">🏆</span> Best Selling Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {topProducts.map((product, idx) => (
          <div key={idx} className="bg-skyblue/30 rounded-xl p-3 text-center hover:shadow-md transition group">
            <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">👗</div>
            <p className="font-medium text-gray-800 text-sm truncate">{product.name}</p>
            <p className="text-xs text-gray-500">{product.sales} sold</p>
            <p className="text-navy font-bold mt-1">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon="💰" trend="+12%" onClick={() => goToTab('orders')} />
        <DashboardCard title="Total Customers" value={totalUsers} icon="👥" trend="+5%" onClick={() => goToTab('users')} />
        <DashboardCard title="Products Sold" value={productSold} icon="📦" trend="-2%" onClick={() => goToTab('products')} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RecentOrdersTable />
        <EarningsChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCustomers />
        <TopProductsGrid />
      </div>
    </>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-skyblue">
      <h2 className="text-xl font-bold text-gray-800 mb-4">All Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-skyblue/40">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-skyblue">
            {users.length === 0 ? <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-400">No users found</td></tr> : users.map(user => <tr key={user._id} className="hover:bg-gray-50"><td className="px-6 py-4">{user.name}</td><td className="px-6 py-4">{user.email}</td><td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div>
      {/* Button to show product form */}
      {!showProductForm && (
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowProductForm(true);
          }}
          className="mb-6 bg-navy text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition"
        >
          + Add New Product
        </button>
      )}
      {showProductForm && (
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleProductSubmit}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          uploading={uploadingImages}
          categoryOptions={categoryOptions}
        />
      )}
      <div className="grid grid-cols-1 gap-4 mt-6">
        {products.map(product => (
          <div key={product._id} className="bg-white p-4 rounded-xl shadow-md border border-skyblue flex justify-between items-center flex-wrap gap-3 hover:shadow-lg transition">
            <div className="flex items-center gap-4">
              <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} className="w-14 h-14 object-cover rounded-lg" />
              <div><h3 className="font-bold text-gray-800">{product.name}</h3><p className="text-sm text-gray-500">${product.price} · {product.category}</p>{product.isNewArrival && <span className="text-xs bg-teal/20 text-navy px-2 py-0.5 rounded-full">New</span>}</div>
            </div>
            <div className="flex gap-2"><button onClick={() => editProduct(product)} className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition">Edit</button><button onClick={() => deleteProduct(product._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-4">
      {contacts.length === 0 ? <p className="text-gray-400">No messages yet.</p> : contacts.map(msg => (
        <div key={msg._id} className="bg-white p-4 rounded-xl shadow-md border border-skyblue hover:shadow-lg transition">
          <p><strong className="text-gray-800">From:</strong> {msg.name} ({msg.email})</p>
          <p className="text-gray-600 mt-1">{msg.message}</p>
          <p className="text-xs text-gray-400 mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      {orders.length === 0 ? <p className="text-gray-400">No orders yet.</p> : orders.map(order => (
        <div key={order._id} className="bg-white p-4 rounded-xl shadow-md border border-skyblue">
          <p><strong className="text-gray-800">Order #{order._id}</strong></p>
          <p>Customer: {order.customerName} ({order.customerEmail})</p>
          <p>Address: {order.customerAddress}</p>
          <p>Total: ${order.totalAmount}</p>
          <p>Status: <span className="px-2 py-1 bg-teal/20 text-navy rounded-full text-xs font-medium">{order.status}</span></p>
          <div className="mt-2"><strong>Items:</strong><ul className="list-disc ml-5">{order.items.map((item, i) => <li key={i}>{item.name} x {item.quantity} - ${item.price * item.quantity}</li>)}</ul></div>
        </div>
      ))}
    </div>
  );

  const Sidebar = () => (
    <motion.div
      className={`bg-gradient-to-b from-teal to-navy text-white transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}
      initial={false}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {sidebarOpen ? (
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="NORA" className="h-8 w-auto" />
            <span className="font-bold text-lg">Admin</span>
          </div>
        ) : (
          <img src="/images/logo.png" alt="NORA" className="h-8 w-auto mx-auto" />
        )}
        <button onClick={toggleSidebar} className="text-white hover:text-gray-200 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition rounded-lg ${activeTab === 'dashboard' ? 'bg-white/20' : ''}`}
            >
              <MdDashboard className="text-xl w-6" />
              {sidebarOpen && <span className="capitalize">Dashboard</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition rounded-lg ${activeTab === 'users' ? 'bg-white/20' : ''}`}
            >
              <MdPeople className="text-xl w-6" />
              {sidebarOpen && <span className="capitalize">Users</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition rounded-lg ${activeTab === 'products' ? 'bg-white/20' : ''}`}
            >
              <MdLocalMall className="text-xl w-6" />
              {sidebarOpen && <span className="capitalize">Products</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition rounded-lg ${activeTab === 'messages' ? 'bg-white/20' : ''}`}
            >
              <MdMessage className="text-xl w-6" />
              {sidebarOpen && <span className="capitalize">Messages</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition rounded-lg ${activeTab === 'orders' ? 'bg-white/20' : ''}`}
            >
              <MdShoppingCart className="text-xl w-6" />
              {sidebarOpen && <span className="capitalize">Orders</span>}
            </button>
          </li>
          <li className="pt-4 border-t border-white/20">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition text-red-200 rounded-lg">
              <MdLogout className="text-xl w-6" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </nav>
    </motion.div>
  );

  const MainContent = () => (
    <div className="flex-1 overflow-auto bg-skyblue/20">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-xl font-bold text-gray-800">NORA Admin</h1>
          <div className="relative w-full max-w-xs">
            <input type="text" placeholder="Search..." className="border rounded-full px-4 py-2 pl-8 w-full text-sm focus:outline-none focus:border-teal" />
            <svg className="w-4 h-4 absolute left-2 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        <div className="text-sm text-gray-500">Welcome, Admin</div>
      </div>
      <div className="p-6">
        {loading ? <p className="text-center py-10">Loading...</p> : (
          activeTab === 'dashboard' ? renderDashboard() :
          activeTab === 'users' ? renderUsers() :
          activeTab === 'products' ? renderProducts() :
          activeTab === 'messages' ? renderMessages() :
          renderOrders()
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-skyblue/20">
      <Sidebar />
      <MainContent />
    </div>
  );
}
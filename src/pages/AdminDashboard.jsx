import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useUser } from '../contexts/UserContext';
import api from '../services/api';
import axios from 'axios';
import ProductForm from '../components/ProductForm';
import { 
  MdDashboard, MdPeople, MdLocalMall, MdMessage, MdShoppingCart, MdLogout,
  MdTrendingUp, MdEmojiEvents, MdStar, MdSell, MdReceipt, MdAttachMoney
} from 'react-icons/md';

// ── Constants ────────────────────────────────────────────────────────────────
const PARENT_CATEGORY_MAP = {
  Dresses:     ['Casual Dresses', 'Maxi Dresses', 'Mini Dresses', 'Office Dresses', 'Party Dresses'],
  Outerwear:   ['Blazers', 'Cardigans', 'Coats', 'Hoodies', 'Jackets'],
  Tops:        ['Blouses', 'Crop Tops', 'Shirts', 'Tank Tops', 'T-Shirts'],
  Bottoms:     ['Jeans', 'Leggings', 'Shorts', 'Skirts', 'Trousers'],
  Accessories: ['Bags', 'Belts', 'Jewelry', 'Sunglasses', 'Watches'],
};
const ALL_SUBCATEGORIES = Object.values(PARENT_CATEGORY_MAP).flat();
const ORDER_STATUSES = ['Pending', 'Processing', 'Completed', 'Cancelled'];
const STATUS_COLORS = {
  Pending:    'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Completed:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-700',
};

// ── Shared UI Helpers ────────────────────────────────────────────────────────
function Badge({ label, colorClass }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>{label}</span>;
}

function ConfirmDialog({ message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
      >
        <div className="flex justify-center mb-4 text-red-500">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <p className="text-navy font-semibold text-center mb-6 text-sm">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-skyblue text-navy text-sm font-medium hover:bg-beige transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">{confirmLabel}</button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { isAuthenticated, logout: adminLogout } = useAdminAuth();
  const { logout: userLogout } = useUser();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminTab') || 'dashboard');
  const [loading, setLoading] = useState(false);

  // ── Data state ───────────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [users, setUsers]       = useState([]);

  // ── Products state ───────────────────────────────────────────────────────
  const [editingProduct, setEditingProduct]   = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productSearch, setProductSearch]             = useState('');
  const [productFilterParent, setProductFilterParent] = useState('');
  const [productFilterSub, setProductFilterSub]       = useState('');
  const [productFilterStock, setProductFilterStock]   = useState('');
  const [productFilterStatus, setProductFilterStatus] = useState('');

  // ── Users state ──────────────────────────────────────────────────────────
  const [editingUser, setEditingUser]           = useState(null);
  const [editUserForm, setEditUserForm]         = useState({ name: '', email: '' });
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);

  // ── Messages state ───────────────────────────────────────────────────────
  const [replyingTo, setReplyingTo]   = useState(null);
  const [replyText, setReplyText]     = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // ── Orders state ─────────────────────────────────────────────────────────
  const [orderSearch, setOrderSearch]           = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState('');
  const [updatingOrderId, setUpdatingOrderId]   = useState(null);

  // ── Dashboard derived ────────────────────────────────────────────────────
  const totalRevenue  = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const recentOrders  = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const productSales = {};
  orders.forEach(o => o.items?.forEach(i => { productSales[i.name] = (productSales[i.name] || 0) + i.quantity; }));
  const topProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 4)
    .map(([name, qty]) => { const p = products.find(p => p.name === name); return { name, sales: qty, price: p?.price || 0 }; });
  if (!topProducts.length && products.length) products.slice(0, 4).forEach(p => topProducts.push({ name: p.name, sales: 0, price: p.price }));

  const customerSpending = {};
  orders.forEach(o => { customerSpending[o.customerName] = (customerSpending[o.customerName] || 0) + (o.totalAmount || 0); });
  const topCustomers = Object.entries(customerSpending).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name, total]) => ({ name, total }));

  // ── Filtered products ────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const q = productSearch.toLowerCase().trim();
    const subsForParent = productFilterParent ? PARENT_CATEGORY_MAP[productFilterParent] : null;
    return products.filter(p => {
      if (q && !p.name?.toLowerCase().includes(q) && !p.sku?.toLowerCase().includes(q) && !p.category?.toLowerCase().includes(q)) return false;
      if (productFilterSub && p.category !== productFilterSub) return false;
      if (!productFilterSub && subsForParent && !subsForParent.includes(p.category)) return false;
      if (productFilterStock === 'in'  && !(p.inStock !== false && p.stock !== 0)) return false;
      if (productFilterStock === 'out' &&  (p.inStock !== false && p.stock !== 0)) return false;
      if (productFilterStatus === 'active'   && p.isActive === false) return false;
      if (productFilterStatus === 'inactive' && p.isActive !== false) return false;
      return true;
    });
  }, [products, productSearch, productFilterParent, productFilterSub, productFilterStock, productFilterStatus]);

  // ── Filtered orders ──────────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    const q = orderSearch.toLowerCase().trim();
    return orders
      .filter(o => {
        if (orderFilterStatus && (o.status || 'Pending') !== orderFilterStatus) return false;
        if (q && !o._id?.toLowerCase().includes(q) && !o.customerName?.toLowerCase().includes(q) && !o.customerEmail?.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, orderSearch, orderFilterStatus]);

  // ── API helpers ──────────────────────────────────────────────────────────
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, oRes, uRes] = await Promise.all([
        api.get('/products'),
        api.get('/admin/contacts'),
        api.get('/admin/orders'),
        api.get('/users').catch(() => ({ data: [] })),
      ]);
      setProducts(pRes.data || []);
      setContacts(cRes.data || []);
      setOrders(oRes.data || []);
      setUsers(uRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!isAuthenticated) navigate('/auth'); fetchAllData(); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem('adminTab', activeTab); }, [activeTab]);

  // ── Product handlers ─────────────────────────────────────────────────────
  const uploadImageToImgBB = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await axios.post('https://api.imgbb.com/1/upload', fd, { params: { key: 'dc53620a11c364989a9ae6cec355ee59' } });
      return res.data.data.url;
    } catch { alert('Failed to upload image.'); return null; }
  };

  const handleProductSubmit = async (formData, imageFiles) => {
    setUploadingImages(true);
    let imageUrls = [...formData.images];
    for (const [i, file] of imageFiles.entries()) {
      if (file) { const url = await uploadImageToImgBB(file); if (url) imageUrls[i] = url; }
    }
    imageUrls = imageUrls.filter(Boolean).slice(0, 4);
    try {
      if (editingProduct) await api.put(`/admin/products/${editingProduct._id}`, { ...formData, images: imageUrls });
      else                 await api.post('/admin/products', { ...formData, images: imageUrls });
      setEditingProduct(null); setShowProductForm(false); fetchAllData();
    } catch { alert('Error saving product'); } finally { setUploadingImages(false); }
  };

  const deleteProduct = async (id) => {
    await api.delete(`/admin/products/${id}`);
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  // ── User handlers ────────────────────────────────────────────────────────
  const openEditUser = (user) => { setEditingUser(user); setEditUserForm({ name: user.name, email: user.email }); };

  const saveEditUser = async () => {
    if (!editUserForm.name.trim() || !editUserForm.email.trim()) return;
    setUsers(prev => prev.map(u => u._id === editingUser._id ? { ...u, ...editUserForm } : u));
    try { await api.put(`/admin/users/${editingUser._id}`, editUserForm); } catch {}
    setEditingUser(null);
  };

  const deleteUser = async (user) => {
    setUsers(prev => prev.filter(u => u._id !== user._id));
    setConfirmDeleteUser(null);
    try { await api.delete(`/admin/users/${user._id}`); } catch {}
  };

  const toggleUserStatus = async (user) => {
    const next = user.isActive === false;
    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: next } : u));
    try { await api.patch(`/admin/users/${user._id}/status`, { isActive: next }); } catch {}
  };

  // ── Message handlers ─────────────────────────────────────────────────────
  const deleteContact = async (id) => {
    setContacts(prev => prev.filter(c => c._id !== id));
    try { await api.delete(`/admin/contacts/${id}`); } catch {}
  };

  const sendReply = async () => {
    if (!replyText.trim() || !replyingTo) return;
    setSendingReply(true);
    const newReply = { message: replyText, sentAt: new Date().toISOString() };
    try {
      const res = await api.post(`/admin/contacts/${replyingTo._id}/reply`, { message: replyText });
      const savedReply = res.data?.reply || newReply;
      setContacts(prev => prev.map(c => c._id === replyingTo._id ? { ...c, replies: [...(c.replies || []), savedReply] } : c));
      setReplyText('');
      setReplyingTo(null);
    } catch {
      // Fallback to mailto if API endpoint not implemented
      setContacts(prev => prev.map(c => c._id === replyingTo._id ? { ...c, replies: [...(c.replies || []), newReply] } : c));
      window.open(`mailto:${replyingTo.email}?subject=Re%3A%20Your%20Message&body=${encodeURIComponent(replyText)}`);
      setReplyText('');
      setReplyingTo(null);
    } finally {
      setSendingReply(false);
    }
  };

  // ── Order handlers ───────────────────────────────────────────────────────
  const updateOrderStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    try { await api.patch(`/admin/orders/${orderId}/status`, { status }); } catch {}
    setUpdatingOrderId(null);
  };

  // ── Misc ─────────────────────────────────────────────────────────────────
  const handleLogout = () => { adminLogout(); userLogout(); navigate('/auth'); };
  const goToTab = (tab) => { setActiveTab(tab); if (!sidebarOpen) setSidebarOpen(true); };

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER: Dashboard
  // ════════════════════════════════════════════════════════════════════════════
  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { 
            title: 'Total Revenue', 
            value: `$${totalRevenue.toLocaleString()}`, 
            icon: <MdShoppingCart size={36} className="text-teal" />, 
            trend: '+12%', 
            tab: 'orders' 
          },
          { 
            title: 'Total Customers', 
            value: users.length, 
            icon: <MdPeople size={36} className="text-teal" />, 
            trend: '+5%', 
            tab: 'users' 
          },
          { 
            title: 'Products Listed', 
            value: products.length, 
            icon: <MdLocalMall size={36} className="text-teal" />, 
            trend: '+3%', 
            tab: 'products' 
          },
        ].map(card => (
          <motion.div key={card.tab} whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.2 }} onClick={() => goToTab(card.tab)}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 cursor-pointer border border-skyblue group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-navy">{card.value}</p>
                <p className={`text-xs mt-2 ${card.trend.startsWith('+') ? 'text-teal' : 'text-red-500'}`}>{card.trend}</p>
              </div>
              <div className="text-4xl opacity-80 group-hover:scale-110 transition-transform">{card.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Orders mini-table */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-skyblue">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <MdReceipt size={20} className="text-teal" /> Recent Orders
            </h2>
            <button onClick={() => setActiveTab('orders')} className="text-teal text-sm hover:underline">View all →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-skyblue/40">
                <th className="text-left py-2 font-semibold text-gray-500 text-xs uppercase">Customer</th>
                <th className="text-left py-2 font-semibold text-gray-500 text-xs uppercase">Total</th>
                <th className="text-left py-2 font-semibold text-gray-500 text-xs uppercase">Status</th>
              </tr></thead>
              <tbody>
                {recentOrders.length === 0
                  ? <tr><td colSpan={3} className="py-4 text-center text-gray-400 text-sm">No orders yet</td></tr>
                  : recentOrders.map(o => (
                    <tr key={o._id} className="border-b border-skyblue/20 hover:bg-skyblue/10">
                      <td className="py-2.5 truncate max-w-[120px] text-navy">{o.customerName}</td>
                      <td className="py-2.5 font-medium text-navy">${(o.totalAmount || 0).toFixed(2)}</td>
                      <td className="py-2.5"><Badge label={o.status || 'Pending'} colorClass={STATUS_COLORS[o.status || 'Pending'] || 'bg-gray-100 text-gray-700'} /></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Earnings chart */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-skyblue">
          <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-2">
            <MdAttachMoney size={20} className="text-teal" /> Earnings (weekly)
          </h2>
          <div className="text-3xl font-bold text-navy">${totalRevenue.toLocaleString()}</div>
          <div className="h-28 flex items-end gap-1.5 mt-4">
            {[40, 60, 30, 80, 50, 70, 45].map((h, i) => (
              <motion.div key={i} className="flex-1 bg-teal rounded-t-lg hover:bg-navy transition-all cursor-pointer"
                style={{ height: `${h}%` }} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.5, delay: i * 0.05 }} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <span key={d}>{d}</span>)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-skyblue">
          <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-4">
            <MdPeople size={20} className="text-teal" /> Top Customers
          </h2>
          {topCustomers.length === 0
            ? <p className="text-gray-400 text-sm">No customers yet</p>
            : topCustomers.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex justify-between items-center border-b border-skyblue/40 py-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-navy">{c.name}</p>
                  <p className="text-xs text-gray-500">Total spent: ${c.total.toFixed(2)}</p>
                </div>
                <Badge label="✨ Top" colorClass="bg-teal/20 text-teal" />
              </motion.div>
            ))
          }
        </div>

        {/* Best Selling Products */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-skyblue">
          <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-4">
            <MdEmojiEvents size={20} className="text-teal" /> Best Selling Products
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {topProducts.map((p, i) => (
              <div key={i} className="bg-skyblue/20 rounded-xl p-3 text-center hover:shadow-md transition group">
                <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                  <MdSell size={28} className="text-teal mx-auto" />
                </div>
                <p className="font-semibold text-navy text-sm truncate">{p.name}</p>
                <p className="text-xs text-gray-500">{p.sales} sold</p>
                <p className="text-teal font-bold mt-1">${p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER: Users
  // ════════════════════════════════════════════════════════════════════════════
  const renderUsers = () => (
    <div className="bg-white rounded-2xl shadow-md border border-skyblue overflow-hidden">
      <div className="px-6 py-4 border-b border-skyblue/40 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">User Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} users registered</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-skyblue/30">
            <tr>
              {['Name', 'Email', 'Joined', 'Status', 'Actions'].map(h => (
                <th key={h} className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${h === 'Joined' ? 'hidden md:table-cell' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-skyblue/20">
            {users.length === 0
              ? <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No users found</td></tr>
              : users.map(user => (
                <tr key={user._id} className="hover:bg-skyblue/10 transition-colors">
                  <td className="px-4 py-3 font-medium text-navy">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{user.email}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      label={user.isActive !== false ? 'Active' : 'Inactive'}
                      colorClass={user.isActive !== false ? 'bg-teal/20 text-teal' : 'bg-gray-100 text-gray-500'}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {/* Edit button commented out */}
                      {/* <button onClick={() => openEditUser(user)}
                        className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium hover:bg-teal transition-colors">
                        Edit
                      </button> */}
                      <button onClick={() => toggleUserStatus(user)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${user.isActive !== false ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' : 'bg-teal/10 text-teal hover:bg-teal/20'}`}>
                        {user.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => setConfirmDeleteUser(user)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Edit User Modal - kept intact */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-bold text-navy mb-4">Edit User</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Full Name</label>
                  <input type="text" value={editUserForm.name} onChange={e => setEditUserForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-skyblue rounded-xl px-3 py-2.5 text-sm text-navy outline-none focus:border-navy" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Email</label>
                  <input type="email" value={editUserForm.email} onChange={e => setEditUserForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-skyblue rounded-xl px-3 py-2.5 text-sm text-navy outline-none focus:border-navy" />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={saveEditUser} className="flex-1 bg-navy text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-teal transition-colors">Save Changes</button>
                <button onClick={() => setEditingUser(null)} className="flex-1 border border-skyblue text-navy py-2.5 rounded-xl font-semibold text-sm hover:bg-beige transition-colors">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {confirmDeleteUser && (
          <ConfirmDialog
            message={`Delete "${confirmDeleteUser.name}"? This cannot be undone.`}
            onConfirm={() => deleteUser(confirmDeleteUser)}
            onCancel={() => setConfirmDeleteUser(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER: Products
  // ════════════════════════════════════════════════════════════════════════════
  const renderProducts = () => {
    const subsForParent = productFilterParent ? PARENT_CATEGORY_MAP[productFilterParent] : ALL_SUBCATEGORIES;
    return (
      <div className="space-y-4">
        {!showProductForm && (
          <button onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
            className="bg-navy text-white px-5 py-2.5 rounded-xl hover:bg-teal transition-colors font-semibold text-sm">
            + Add New Product
          </button>
        )}

        {showProductForm && (
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleProductSubmit}
            onCancel={() => { setShowProductForm(false); setEditingProduct(null); }}
            uploading={uploadingImages}
            categoryOptions={ALL_SUBCATEGORIES}
          />
        )}

        {/* Search + Filters bar */}
        <div className="bg-white rounded-2xl border border-skyblue p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2 xl:col-span-2">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by name, SKU or category…" value={productSearch} onChange={e => setProductSearch(e.target.value)}
              className="w-full border border-skyblue rounded-xl pl-9 pr-3 py-2.5 text-sm text-navy outline-none focus:border-navy" />
          </div>

          {/* Category */}
          <select value={productFilterParent} onChange={e => { setProductFilterParent(e.target.value); setProductFilterSub(''); }}
            className="border border-skyblue rounded-xl px-3 py-2.5 text-sm text-navy outline-none focus:border-navy bg-white">
            <option value="">All Categories</option>
            {Object.keys(PARENT_CATEGORY_MAP).map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Subcategory */}
          <select value={productFilterSub} onChange={e => setProductFilterSub(e.target.value)}
            className="border border-skyblue rounded-xl px-3 py-2.5 text-sm text-navy outline-none focus:border-navy bg-white">
            <option value="">All Subcategories</option>
            {subsForParent.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Stock + Status */}
          <div className="flex gap-2">
            <select value={productFilterStock} onChange={e => setProductFilterStock(e.target.value)}
              className="flex-1 border border-skyblue rounded-xl px-2 py-2.5 text-sm text-navy outline-none focus:border-navy bg-white">
              <option value="">All Stock</option>
              <option value="in">In Stock</option>
              <option value="out">Out of Stock</option>
            </select>
            <select value={productFilterStatus} onChange={e => setProductFilterStatus(e.target.value)}
              className="flex-1 border border-skyblue rounded-xl px-2 py-2.5 text-sm text-navy outline-none focus:border-navy bg-white">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-gray-500">{filteredProducts.length} of {products.length} products</p>

        <div className="space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-skyblue p-10 text-center text-gray-400">No products match your filters</div>
          ) : filteredProducts.map(product => (
            <div key={product._id} className="bg-white p-4 rounded-2xl shadow-sm border border-skyblue flex items-center justify-between flex-wrap gap-3 hover:shadow-md transition">
              <div className="flex items-center gap-4 min-w-0">
                <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} className="w-14 h-14 object-cover rounded-xl bg-beige flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-navy truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500">${product.price} · {product.category}</p>
                  {product.sku && <p className="text-xs text-gray-400">SKU: {product.sku}</p>}
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {product.isNewArrival && <Badge label="New" colorClass="bg-teal/20 text-teal" />}
                    <Badge
                      label={product.isActive === false ? 'Inactive' : 'Active'}
                      colorClass={product.isActive === false ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}
                    />
                    <Badge
                      label={product.inStock === false || product.stock === 0 ? 'Out of Stock' : 'In Stock'}
                      colorClass={product.inStock === false || product.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                  className="bg-navy text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal transition-colors">Edit</button>
                <button onClick={() => { if (window.confirm('Delete this product?')) deleteProduct(product._id); }}
                  className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER: Messages
  // ════════════════════════════════════════════════════════════════════════════
  const renderMessages = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-md border border-skyblue overflow-hidden">
        <div className="px-6 py-4 border-b border-skyblue/40">
          <h2 className="text-xl font-bold text-navy">Messages</h2>
          <p className="text-sm text-gray-500 mt-0.5">{contacts.length} message{contacts.length !== 1 ? 's' : ''} received</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-skyblue/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Message</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-skyblue/20">
              {contacts.length === 0
                ? <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No messages yet</td></tr>
                : contacts.flatMap(msg => {
                  const rows = [
                    <tr key={msg._id} className="hover:bg-skyblue/10 transition-colors">
                      <td className="px-4 py-3 font-medium text-navy">{msg.name}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{msg.email}</td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                        <p className="truncate max-w-xs">{msg.message}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => { setReplyingTo(msg); setReplyText(''); }}
                            className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium hover:bg-teal transition-colors">
                            Reply
                          </button>
                          <button onClick={() => deleteContact(msg._id)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ];
                  if (msg.replies?.length > 0) {
                    rows.push(
                      <tr key={`${msg._id}-replies`} className="bg-teal/5 border-b border-skyblue/20">
                        <td colSpan={5} className="px-6 py-3">
                          <p className="text-xs font-semibold text-teal mb-2">Reply History ({msg.replies.length})</p>
                          <div className="space-y-2">
                            {msg.replies.map((r, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-gray-600 bg-white rounded-lg px-3 py-2 border border-skyblue/30">
                                <span className="text-teal font-bold mt-0.5">↩</span>
                                <div className="flex-1">
                                  <p>{r.message}</p>
                                  {r.sentAt && <p className="text-gray-400 mt-0.5">{new Date(r.sentAt).toLocaleString()}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  return rows;
                })
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {replyingTo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg"
            >
              <h3 className="text-lg font-bold text-navy">Reply to {replyingTo.name}</h3>
              <p className="text-sm text-gray-500 mb-3">→ {replyingTo.email}</p>
              <div className="bg-beige rounded-xl p-3 mb-4 border-l-4 border-teal">
                <p className="text-xs font-semibold text-gray-500 mb-1">Original message:</p>
                <p className="text-sm text-gray-700">{replyingTo.message}</p>
              </div>
              <textarea rows={4} placeholder="Write your reply…" value={replyText} onChange={e => setReplyText(e.target.value)}
                className="w-full border border-skyblue rounded-xl px-3 py-2.5 text-sm text-navy outline-none focus:border-navy resize-none" />
              <div className="flex gap-3 mt-4">
                <button onClick={sendReply} disabled={sendingReply || !replyText.trim()}
                  className="flex-1 bg-navy text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-teal transition-colors disabled:opacity-50">
                  {sendingReply ? 'Sending…' : '✉ Send Reply'}
                </button>
                <button onClick={() => setReplyingTo(null)} className="flex-1 border border-skyblue text-navy py-2.5 rounded-xl font-semibold text-sm hover:bg-beige transition-colors">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER: Orders
  // ════════════════════════════════════════════════════════════════════════════
  const renderOrders = () => (
    <div className="space-y-4">
      {/* Search + Filter */}
      <div className="bg-white rounded-2xl border border-skyblue p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search by Order ID or Customer…" value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
            className="w-full border border-skyblue rounded-xl pl-9 pr-3 py-2.5 text-sm text-navy outline-none focus:border-navy" />
        </div>
        <select value={orderFilterStatus} onChange={e => setOrderFilterStatus(e.target.value)}
          className="border border-skyblue rounded-xl px-3 py-2.5 text-sm text-navy outline-none focus:border-navy bg-white sm:w-44">
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <p className="text-xs text-gray-500">{filteredOrders.length} of {orders.length} orders</p>

      <div className="bg-white rounded-2xl shadow-md border border-skyblue overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-skyblue/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden xl:table-cell">Products</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Qty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-skyblue/20">
              {filteredOrders.length === 0
                ? <tr><td colSpan={8} className="px-6 py-10 text-center text-gray-400">No orders found</td></tr>
                : filteredOrders.map(order => {
                  const totalQty = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;
                  const currentStatus = order.status || 'Pending';
                  const isUpdating = updatingOrderId === order._id;
                  return (
                    <tr key={order._id} className="hover:bg-skyblue/10 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">#{order._id?.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy text-xs">{order.customerName}</p>
                        <p className="text-xs text-gray-400">{order.customerEmail}</p>
                        {order.customerPhone && <p className="text-xs text-gray-400">{order.customerPhone}</p>}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell max-w-[200px]">
                        <p className="text-xs text-gray-600 truncate">{order.items?.map(i => `${i.name} ×${i.quantity}`).join(', ')}</p>
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-navy hidden md:table-cell">{totalQty}</td>
                      <td className="px-4 py-3 font-bold text-navy">${(order.totalAmount || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <Badge label="Paid" colorClass="bg-green-100 text-green-700" />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={currentStatus}
                          onChange={e => updateOrderStatus(order._id, e.target.value)}
                          disabled={isUpdating}
                          className={`text-xs font-semibold rounded-full px-2 py-1 border-0 outline-none cursor-pointer appearance-none ${STATUS_COLORS[currentStatus] || 'bg-gray-100 text-gray-700'} ${isUpdating ? 'opacity-50' : ''}`}
                        >
                          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // LAYOUT
  // ════════════════════════════════════════════════════════════════════════════
  const NAV_ITEMS = [
    { tab: 'dashboard', icon: <MdDashboard className="text-xl flex-shrink-0" />, label: 'Dashboard' },
    { tab: 'users',     icon: <MdPeople    className="text-xl flex-shrink-0" />, label: 'Users' },
    { tab: 'products',  icon: <MdLocalMall className="text-xl flex-shrink-0" />, label: 'Products' },
    { tab: 'messages',  icon: <MdMessage   className="text-xl flex-shrink-0" />, label: 'Messages' },
    { tab: 'orders',    icon: <MdShoppingCart className="text-xl flex-shrink-0" />, label: 'Orders' },
  ];

  return (
    <div className="flex min-h-screen bg-skyblue/10">
      {/* Sidebar */}
      <motion.div
        className={`bg-gradient-to-b from-teal to-navy text-white flex flex-col flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-56' : 'w-16'}`}
        initial={false}
      >
        <div className="flex items-center justify-between p-3 border-b border-white/20 h-16">
          {sidebarOpen && (
            <div className="flex items-center gap-2 min-w-0">
              <img src="/images/logo.png" alt="NORA" className="h-8 w-auto flex-shrink-0" />
              <span className="font-bold text-base truncate">Admin</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(s => !s)} className="text-white/80 hover:text-white transition flex-shrink-0 ml-auto">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-3">
          <ul className="space-y-0.5 px-2">
            {NAV_ITEMS.map(({ tab, icon, label }) => (
              <li key={tab}>
                <button onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${activeTab === tab ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'}`}
                  title={!sidebarOpen ? label : undefined}
                >
                  {icon}
                  {sidebarOpen && <span>{label}</span>}
                </button>
              </li>
            ))}
            <li className="pt-3 mt-3 border-t border-white/20">
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-200 hover:bg-white/10 transition-colors"
                title={!sidebarOpen ? 'Logout' : undefined}
              >
                <MdLogout className="text-xl flex-shrink-0" />
                {sidebarOpen && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <div className="bg-white shadow-sm px-6 h-16 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <h1 className="text-lg font-bold text-navy">NORA Admin Dashboard</h1>
          <span className="text-sm text-gray-500 hidden sm:block">Welcome, Admin</span>
        </div>

        <div className="p-4 md:p-6 flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            activeTab === 'dashboard' ? renderDashboard() :
            activeTab === 'users'     ? renderUsers() :
            activeTab === 'products'  ? renderProducts() :
            activeTab === 'messages'  ? renderMessages() :
            renderOrders()
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Profile() {
  const { user, logout, updateUser } = useUser();
  const { showToast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  if (!user) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl mb-4 text-navy">Please sign in to view your profile</h2>
        <Link to="/auth" className="bg-navy text-white px-6 py-2 rounded-xl hover:bg-teal transition-colors">Sign In</Link>
      </div>
    );
  }

  const openEdit = () => {
    setFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    setEditMode(true);
  };

  const cancelEdit = () => setEditMode(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Name is required', 'error');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSaving(true);
    try {
      const res = await api.patch('/users/profile', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });
      updateUser(res.data);
      showToast('Profile updated successfully!', 'success');
      setEditMode(false);
    } catch {
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-navy text-white px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Profile</h1>
          {!editMode && (
            <button
              onClick={openEdit}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.586 2.586a2 2 0 112.828 2.828L12 14.828l-4 1 1-4 9.414-9.414z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div>
              <label className="block text-gray-500 text-sm mb-1">Full Name</label>
              <input
                type="text"
                id="profile-name"
                name="name"
                required
                autoComplete="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-skyblue rounded-lg px-3 py-2.5 text-sm text-navy outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Email Address</label>
              <input
                type="email"
                id="profile-email"
                name="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-skyblue rounded-lg px-3 py-2.5 text-sm text-navy outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Phone Number</label>
              <input
                type="tel"
                id="profile-phone"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Optional"
                className="w-full border border-skyblue rounded-lg px-3 py-2.5 text-sm text-navy outline-none focus:border-navy"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-navy text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-teal transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-beige text-navy font-semibold px-6 py-2.5 rounded-xl hover:bg-skyblue/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            <div className="border-b pb-3">
              <p className="text-gray-500 text-sm">Full Name</p>
              <p className="text-lg font-medium text-navy">{user.name}</p>
            </div>
            <div className="border-b pb-3">
              <p className="text-gray-500 text-sm">Email Address</p>
              <p className="text-lg font-medium text-navy">{user.email}</p>
            </div>
            {user.phone && (
              <div className="border-b pb-3">
                <p className="text-gray-500 text-sm">Phone Number</p>
                <p className="text-lg font-medium text-navy">{user.phone}</p>
              </div>
            )}
            <div className="border-b pb-3">
              <p className="text-gray-500 text-sm">Account Type</p>
              <p className="text-lg font-medium text-navy">{user.isAdmin ? 'Administrator' : 'Customer'}</p>
            </div>
            <div className="pt-4">
              <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

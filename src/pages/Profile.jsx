import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useUser();

  if (!user) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl mb-4">Please sign in to view your profile</h2>
        <Link to="/auth" className="bg-primary text-white px-6 py-2 rounded">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-primary text-white px-6 py-4">
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>
        <div className="p-6 space-y-4">
          <div className="border-b pb-3">
            <p className="text-gray-500 text-sm">Full Name</p>
            <p className="text-lg font-medium">{user.name}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-gray-500 text-sm">Email Address</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-gray-500 text-sm">Account Type</p>
            <p className="text-lg font-medium">{user.isAdmin ? 'Administrator' : 'Customer'}</p>
          </div>
          <div className="pt-4">
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
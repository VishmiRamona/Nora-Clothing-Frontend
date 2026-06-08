import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import api from '../services/api';

export default function Orders() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.email) {
      api.get(`/orders/my-orders?email=${user.email}`)
        .then(res => setOrders(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl mb-4">Please sign in to view your orders</h2>
        <Link to="/auth" className="bg-primary text-white px-6 py-2 rounded">Sign In</Link>
      </div>
    );
  }

  if (loading) return <div className="container mx-auto py-16 text-center">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl mb-4">You haven't placed any orders yet.</h2>
        <Link to="/features" className="bg-primary text-white px-6 py-2 rounded">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Order #{order._id}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {order.status}
              </span>
            </div>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between border-b border-gray-100 py-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-2 border-t border-gray-200 text-right font-bold">
              Total: ${order.totalAmount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
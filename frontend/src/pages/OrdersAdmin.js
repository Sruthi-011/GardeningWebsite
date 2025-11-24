import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5001/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err.response ? err.response.data : err);
      alert('❌ Failed to get orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5001/api/admin/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`✅ Order ${orderId} status updated to ${status}`);
      fetchOrders();
    } catch (err) {
      console.log(err.response ? err.response.data : err);
      alert('❌ Failed to update status');
    }
  };

  if (!token) return <p>Please login as admin to view orders.</p>;
  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Orders 📦</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div
            key={order.order_id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px',
              background: '#f9f9f9'
            }}
          >
            <p><strong>Order ID:</strong> {order.order_id}</p>
            <p><strong>User ID:</strong> {order.user_id}</p>
            <p><strong>Total Price:</strong> ₹{order.total_price}</p>
            <p><strong>Status:</strong> {order.status}</p>

            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Payment Method:</strong> {order.payment_method}</p>

            <p><strong>Products:</strong></p>
            <ul>
              {order.products.map(product => (
                <li key={product.product_id}>
                  {product.name} × {product.quantity} (₹{product.price} each)
                </li>
              ))}
            </ul>

            <div>
              <label><strong>Change Status: </strong></label>
              <select
                value={order.status}
                onChange={e => updateStatus(order.order_id, e.target.value)}
                style={{ marginLeft: '10px' }}
              >
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersAdmin;

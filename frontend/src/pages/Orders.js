import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5001/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err.response ? err.response.data : err);
        alert('❌ Failed to fetch orders. Server error.');
      }
    };
    fetchOrders();
  }, [token]);

  if (!token) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Please login to view your orders.</p>;
  }

  const statusColor = (status) => {
    switch (status) {
      case 'Pending': return '#FFA500';
      case 'Processing': return '#2196F3';
      case 'Shipped': return '#9C27B0';
      case 'Delivered': return '#4CAF50';
      case 'Cancelled': return '#f44336';
      default: return '#555';
    }
  };

  return (
    <div style={mainContainerStyle}>
      <div style={leftSectionStyle}>
        <h2 style={titleStyle}>Your Orders 📦</h2>

        {orders.length === 0 ? (
          <p style={emptyStyle}>You have no orders yet. Place some orders to see them here!</p>
        ) : (
          <div style={ordersWrapperStyle}>
            {orders.map((order) => (
              <div
                key={order.order_id}
                style={orderCardStyle}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <h3>Order #{order.order_id}</h3>
                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ₹{order.total_price}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span style={{ color: statusColor(order.status), fontWeight: 'bold' }}>
                    {order.status}
                  </span>
                </p>
                <p><strong>Items:</strong></p>
                {order.products && order.products.length > 0 ? (
                  <ul style={productListStyle}>
                    {order.products.map(product => (
                      <li key={product.product_id}>
                        {product.name} x {product.quantity} (₹{product.price} each)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#777', fontStyle: 'italic' }}>No items found in this order</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={rightImageStyle}></div>

      <style>
        {`
          @media (max-width: 768px) {
            div[style*="display: flex"][style*="row"] {
              flex-direction: column;
            }
            div[style*="background-image"] {
              height: 250px;
              width: 100%;
              background-size: cover;
              background-position: center;
            }
          }
        `}
      </style>
    </div>
  );
};

const mainContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  height: '100vh',
  width: '100vw',
  fontFamily: 'Arial, sans-serif',
  overflow: 'hidden',
};

const leftSectionStyle = {
  flex: 1,
  padding: '30px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  overflowY: 'auto',
};

const rightImageStyle = {
  flex: 1,
  backgroundImage: 'url("http://localhost:5001/uploads/Orders.jpeg")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  backgroundSize: 'cover',
  height: '100vh',
  width: '50vw',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '25px',
  color: '#2e7d32',
  textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
};

const emptyStyle = {
  textAlign: 'center',
  color: '#555',
  fontSize: '16px',
};

const ordersWrapperStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '20px',
  width: '100%',
};

const orderCardStyle = {
  border: '1px solid #ccc',
  borderRadius: '12px',
  padding: '20px',
  width: '320px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  backgroundColor: '#ffffff',
  transition: 'transform 0.3s, box-shadow 0.3s',
};

const productListStyle = {
  paddingLeft: '20px',
  marginTop: '5px',
};

export default Orders;

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
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data);
            } catch (err) {
                console.log(err);
                alert('Failed to fetch orders');
            }
        };
        fetchOrders();
    }, [token]);

    if (!token) return <p style={{ textAlign: 'center', padding: '20px' }}>Please login to view your orders.</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Orders 📦</h2>

            {orders.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#555' }}>
                    You have no orders yet. Place some orders to see them here!
                </p>
            ) : (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '20px'
                }}>
                    {orders.map(order => (
                        <div key={order.id} style={{
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            padding: '20px',
                            width: '300px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            backgroundColor: '#f9f9f9',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <h3>Order #{order.id}</h3>
                            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {order.status || 'Pending'}</p>
                            <p><strong>Total:</strong> ₹{order.total}</p>
                            <p><strong>Items:</strong></p>
                            <ul style={{ paddingLeft: '20px' }}>
                                {order.items && order.items.length > 0 ? (
                                    order.items.map(item => (
                                        <li key={item.product_id}>{item.product_name} x {item.quantity}</li>
                                    ))
                                ) : (
                                    <li>No items found</li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;

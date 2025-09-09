import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem('token');

  // Fetch cart items from backend
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5001/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(res.data);
      } catch (err) {
        console.log(err);
        alert('Failed to fetch cart');
      }
    };
    fetchCart();
  }, [token]);

  // Increase quantity
  const increaseQuantity = async (cartId, currentQuantity) => {
    try {
      await axios.put(`http://localhost:5001/api/cart/${cartId}`, {
        quantity: currentQuantity + 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(prev => prev.map(item => item.cart_id === cartId ? { ...item, quantity: item.quantity + 1 } : item));
    } catch (err) {
      console.log(err);
      alert('Failed to update quantity');
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (cartId, currentQuantity) => {
    if (currentQuantity === 1) return;
    try {
      await axios.put(`http://localhost:5001/api/cart/${cartId}`, {
        quantity: currentQuantity - 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(prev => prev.map(item => item.cart_id === cartId ? { ...item, quantity: item.quantity - 1 } : item));
    } catch (err) {
      console.log(err);
      alert('Failed to update quantity');
    }
  };

  // Remove item from cart
  const removeItem = async (cartId) => {
    try {
      await axios.delete(`http://localhost:5001/api/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(prev => prev.filter(item => item.cart_id !== cartId));
    } catch (err) {
      console.log(err);
      alert('Failed to remove item');
    }
  };

  if (!token) return <p style={{ textAlign: 'center', marginTop: '20px' }}>Please login to view your cart.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Cart 🛒</h2>
      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Your cart is empty</p>
      ) : (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px'
        }}>
          {cartItems.map(item => (
            <div key={item.cart_id} style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '15px',
              width: '250px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              position: 'relative',
              textAlign: 'center'
            }}>
              {item.image_url && (
                <img
                  src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:5001${item.image_url}`}
                  alt={item.name}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
                <button
                  onClick={() => decreaseQuantity(item.cart_id, item.quantity)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >-</button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.cart_id, item.quantity)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >+</button>
              </div>
              <p><strong>Total:</strong> ₹{item.price * item.quantity}</p>
              <button
                onClick={() => removeItem(item.cart_id)}
                style={{
                  backgroundColor: '#ff9800',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;

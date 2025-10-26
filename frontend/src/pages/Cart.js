import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

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

  const increaseQuantity = async (cartId, currentQuantity, stock) => {
    if (currentQuantity >= stock) return alert('❌ Cannot add more. Stock limit reached.');
    try {
      await axios.put(
        `http://localhost:5001/api/cart/${cartId}`,
        { quantity: currentQuantity + 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(prev => prev.map(item => item.cart_id === cartId ? { ...item, quantity: item.quantity + 1 } : item));
    } catch (err) {
      console.log(err);
      alert('Failed to update quantity');
    }
  };

  const decreaseQuantity = async (cartId, currentQuantity) => {
    if (currentQuantity <= 1) return;
    try {
      await axios.put(
        `http://localhost:5001/api/cart/${cartId}`,
        { quantity: currentQuantity - 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(prev => prev.map(item => item.cart_id === cartId ? { ...item, quantity: item.quantity - 1 } : item));
    } catch (err) {
      console.log(err);
      alert('Failed to update quantity');
    }
  };

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

  const handleCheckout = async () => {
    if (cartItems.length === 0) return alert('Your cart is empty');

    const itemsForCheckout = cartItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));

    const total_price = itemsForCheckout.reduce((acc, item) => acc + item.price * item.quantity, 0);

    try {
      await axios.post(
        'http://localhost:5001/api/cart/checkout',
        { items: itemsForCheckout, total_price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Checkout successful! Your order has been placed.');
      setCartItems([]);
      navigate('/orders');
    } catch (err) {
      console.log(err.response ? err.response.data : err);
      alert('❌ Checkout failed. Server error.');
    }
  };

  const handleHover = (e, enter = true, color = '') => {
    e.currentTarget.style.transform = enter ? 'scale(1.05)' : 'scale(1)';
    if (color) e.currentTarget.style.backgroundColor = enter ? color : e.currentTarget.dataset.originalColor;
  };

  if (!token) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Please login to view your cart.</p>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Your Cart 🛒</h2>
      {cartItems.length === 0 ? (
        <p style={emptyStyle}>Your cart is empty</p>
      ) : (
        <>
          <div style={gridStyle}>
            {cartItems.map(item => (
              <div key={item.cart_id} style={cardStyle}>
                {item.image_url && <img src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:5001${item.image_url}`} alt={item.name} style={imageStyle} />}
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <p>Available Stock: {item.stock}</p>

                <div style={quantityStyle}>
                  <button
                    onClick={() => decreaseQuantity(item.cart_id, item.quantity)}
                    style={decreaseBtnStyle}
                    data-original-color="#f44336"
                    onMouseEnter={(e) => handleHover(e, true, '#e53935')}
                    onMouseLeave={(e) => handleHover(e, false)}
                  >-</button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(item.cart_id, item.quantity, item.stock)}
                    style={increaseBtnStyle}
                    data-original-color="#4CAF50"
                    onMouseEnter={(e) => handleHover(e, true, '#45A049')}
                    onMouseLeave={(e) => handleHover(e, false)}
                  >+</button>
                </div>

                <p>Total: ₹{item.price * item.quantity}</p>

                <button
                  onClick={() => removeItem(item.cart_id)}
                  style={removeBtnStyle}
                  data-original-color="#ff9800"
                  onMouseEnter={(e) => handleHover(e, true, '#fb8c00')}
                  onMouseLeave={(e) => handleHover(e, false)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={handleCheckout}
              style={checkoutBtnStyle}
              data-original-color="#2196F3"
              onMouseEnter={(e) => handleHover(e, true, '#1E88E5')}
              onMouseLeave={(e) => handleHover(e, false)}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const containerStyle = {
  minHeight: '100vh',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '20px',
  color: '#4CAF50',
  textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
};

const emptyStyle = {
  textAlign: 'center',
  color: '#4CAF50',
  fontSize: '16px',
  marginTop: '20px',
  textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
};

const gridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '20px',
};

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '15px',
  width: '250px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  textAlign: 'center',
};

const imageStyle = {
  width: '100%',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '8px',
};

const quantityStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  margin: '10px 0',
};

const decreaseBtnStyle = {
  padding: '5px 10px',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const increaseBtnStyle = {
  padding: '5px 10px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const removeBtnStyle = {
  backgroundColor: '#ff9800',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '5px',
  cursor: 'pointer',
  width: '100%',
};

const checkoutBtnStyle = {
  backgroundColor: '#2196F3',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

export default Cart;

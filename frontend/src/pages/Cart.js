import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // 🧾 Load cart items
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

  // ➕ and ➖ quantity functions
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
      alert('Failed to remove item');
    }
  };

  // 🧾 Checkout button click
  const handleCheckout = () => {
    if (cartItems.length === 0) return alert('Your cart is empty');
    setShowCheckoutForm(true);
  };

  // 🪙 Place order
  const handlePlaceOrder = async () => {
    if (!address || !phone) return alert('Please fill in address and phone number.');

    const itemsForCheckout = cartItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));

    const total_price = itemsForCheckout.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // COD flow
    if (paymentMethod === 'COD') {
      try {
        await axios.post(
          'http://localhost:5001/api/cart/checkout',
          { items: itemsForCheckout, total_price, address, phone, paymentMethod },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('✅ Order placed successfully with COD!');
        setCartItems([]);
        setShowCheckoutForm(false);
        navigate('/orders');
      } catch (err) {
        alert('❌ Checkout failed.');
      }
    } else {
      // Online Payment via Razorpay
      try {
        const { data: order } = await axios.post(
          'http://localhost:5001/api/payment/orders',
          { amount: total_price },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: 'INR',
          name: 'GreenLeaf Gardening',
          description: 'Plant Purchase Payment',
          order_id: order.id,
          handler: async function (response) {
            try {
              // Verify and create final order
              await axios.post(
                'http://localhost:5001/api/cart/checkout',
                {
                  items: itemsForCheckout,
                  total_price,
                  address,
                  phone,
                  paymentMethod: 'Online',
                  payment_id: response.razorpay_payment_id,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              alert('✅ Payment successful! Order placed.');
              setCartItems([]);
              setShowCheckoutForm(false);
              navigate('/orders');
            } catch (err) {
              alert('❌ Failed to confirm payment.');
            }
          },
          prefill: {
            name: 'Sruthi',
            email: 'user@example.com',
            contact: phone
          },
          theme: {
            color: '#4CAF50'
          }
        };

        const razor = new window.Razorpay(options);
        razor.open();
      } catch (err) {
        alert('❌ Razorpay initialization failed.');
        console.log(err);
      }
    }
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (!token) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Please login to view your cart.</p>;
  }

  // ---------- UI BELOW ----------
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
                {item.image_url && (
                  <img
                    src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:5001${item.image_url}`}
                    alt={item.name}
                    style={imageStyle}
                  />
                )}
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <div style={quantityStyle}>
                  <button onClick={() => decreaseQuantity(item.cart_id, item.quantity)} style={btnRed}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.cart_id, item.quantity, item.stock)} style={btnGreen}>+</button>
                </div>
                <p>Total: ₹{item.price * item.quantity}</p>
                <button onClick={() => removeItem(item.cart_id)} style={btnOrange}>Remove</button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={handleCheckout} style={btnBlue}>Checkout</button>
          </div>
        </>
      )}

      {/* ✅ Checkout Modal */}
      {showCheckoutForm && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>🧾 Checkout Details</h3>
            <label>Address:</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
            <label>Phone Number:</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
            <label>Payment Method:</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={inputStyle}>
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="Online">Online Payment</option>
            </select>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
              <button onClick={handlePlaceOrder} style={btnGreen}>Place Order</button>
              <button onClick={() => setShowCheckoutForm(false)} style={btnRed}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- Styles ----------
const containerStyle = { padding: '20px', textAlign: 'center' };
const titleStyle = { color: '#4CAF50' };
const emptyStyle = { color: '#777' };
const gridStyle = { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' };
const cardStyle = { border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '250px' };
const imageStyle = { width: '100%', height: '150px', borderRadius: '8px', objectFit: 'cover' };
const quantityStyle = { display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px 0' };

const btnGreen = { backgroundColor: '#4CAF50', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px' };
const btnRed = { backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px' };
const btnBlue = { backgroundColor: '#2196F3', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px' };
const btnOrange = { backgroundColor: '#ff9800', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px' };

const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalStyle = { background: '#fff', padding: '25px', borderRadius: '10px', width: '350px', textAlign: 'left' };
const inputStyle = { width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' };

export default Cart;

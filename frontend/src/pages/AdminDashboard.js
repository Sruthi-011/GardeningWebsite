import React, { useState } from 'react';
import ProductsAdmin from './ProductsAdmin';
import UsersAdmin from './UsersAdmin';
import OrdersAdmin from './OrdersAdmin';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');

  const menuItems = [
    { key: 'products', label: 'Manage Products' },
    { key: 'users', label: 'Manage Users' },
    { key: 'orders', label: 'View Orders' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '220px',
        backgroundColor: '#4CAF50',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', cursor: 'pointer' }}>Admin Panel</h2>
        {menuItems.map(item => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            style={{
              backgroundColor: activeTab === item.key ? '#388E3C' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              marginBottom: '10px',
              textAlign: 'left',
              cursor: 'pointer',
              borderRadius: '5px',
              fontWeight: '500'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f1f1f1' }}>
        {activeTab === 'products' && <ProductsAdmin />}
        {activeTab === 'users' && <UsersAdmin />}
        {activeTab === 'orders' && <OrdersAdmin />}
      </div>
    </div>
  );
};

export default AdminDashboard;

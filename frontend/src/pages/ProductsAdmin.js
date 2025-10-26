import React, { useState, useEffect, useCallback } from 'react';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const token = localStorage.getItem('token');

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    if (!token) {
      setError('You must be logged in as admin.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/admin/products', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to load products. Server error.');
        setLoading(false);
        return;
      }

      setProducts(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load products. Server error.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update product
  const updateProduct = async (id, updatedFields) => {
    try {
      const res = await fetch(`http://localhost:5001/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update product.');
        return;
      }

      setSuccessMsg(data.message || 'Product updated successfully.');
      setEditingProductId(null);
      fetchProducts();
    } catch (err) {
      console.error('Update fetch error:', err);
      setError('Failed to update product. Server error.');
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`http://localhost:5001/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to delete product.');
        return;
      }

      setSuccessMsg(data.message || 'Product deleted successfully.');
      fetchProducts();
    } catch (err) {
      console.error('Delete fetch error:', err);
      setError('Failed to delete product. Server error.');
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Products Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No products found</td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {editingProductId === p.id ? (
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    />
                  ) : (
                    p.name
                  )}
                </td>
                <td>
                  {editingProductId === p.id ? (
                    <input
                      type="number"
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                    />
                  ) : (
                    p.price
                  )}
                </td>
                <td>
                  {editingProductId === p.id ? (
                    <input
                      type="text"
                      value={editFormData.category}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    />
                  ) : (
                    p.category
                  )}
                </td>
                <td>
                  {editingProductId === p.id ? (
                    <input
                      type="number"
                      value={editFormData.stock}
                      onChange={(e) => setEditFormData({ ...editFormData, stock: Number(e.target.value) })}
                    />
                  ) : (
                    p.stock
                  )}
                </td>
                <td>
                  {editingProductId === p.id ? (
                    <input
                      type="text"
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    />
                  ) : (
                    p.description || '-'
                  )}
                </td>
                <td>
                  {editingProductId === p.id ? (
                    <>
                      <button onClick={() => updateProduct(p.id, editFormData)}>Save</button>
                      <button onClick={() => setEditingProductId(null)} style={{ marginLeft: '10px' }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingProductId(p.id);
                          setEditFormData({
                            name: p.name,
                            price: p.price,
                            category: p.category,
                            stock: p.stock,
                            description: p.description || '',
                            season: p.season || '',
                            is_featured: p.is_featured || false,
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteProduct(p.id)} style={{ marginLeft: '10px', color: 'red' }}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsAdmin;
